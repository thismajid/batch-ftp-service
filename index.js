import ftp from "ftp";
import csv from "csv-parser";
import mongoose from "mongoose";
import schedule from "node-schedule";

import { ftpCredentials, mongodbUrl } from "./config.js";

const ftpClient = new ftp();
const url = mongodbUrl;
const dirPath = ftpCredentials.dirPath;

console.log("Batch service started");

// MongoDB schema
const CustomerSchema = new mongoose.Schema({}, { strict: false });
const AuditSchema = new mongoose.Schema({
  filename: String,
  processedAt: Date,
  recordsInserted: Number,
  fileDeleted: Boolean,
});

// Connect to MongoDB
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const Customer = mongoose.model("Customer", CustomerSchema);
const Audit = mongoose.model("Audit", AuditSchema);

// Connect to the FTP server
ftpClient.on("ready", function () {
  console.log("FTP connection ready");
  schedule.scheduleJob("*/5 * * * * *", function () {
    ftpClient.list(dirPath, function (err, list) {
      if (err) throw err;
      console.log(list);
      list.forEach(function (file) {
        const filePath = dirPath + file.name;
        if (file.type === "d") {
          console.log("Skipping non-regular file:", filePath);
          return;
        }
        ftpClient.get(filePath, function (err, stream) {
          if (err) {
            console.error("There was an error retrieving the file.", err);
            return;
          }
          let results = [];
          stream.once("close", function () {});
          stream
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
              Customer.insertMany(results)
                .then((docs) => {
                  console.log("Number of documents inserted: " + docs.length);
                  // Delete the file from the FTP server after successful insertion
                  ftpClient.delete(filePath, function (err) {
                    if (err) {
                      console.error(
                        "There was an error deleting the file.",
                        err
                      );
                      return;
                    }
                    console.log("File deleted successfully");
                    // Create an audit log
                    const auditLog = new Audit({
                      filename: filePath,
                      processedAt: new Date(),
                      recordsInserted: docs.length,
                      fileDeleted: true,
                    });
                    auditLog
                      .save()
                      .then(() => console.log("Audit log created"))
                      .catch((err) =>
                        console.error("Error creating audit log:", err)
                      );
                  });
                })
                .catch((err) =>
                  console.error("Error inserting documents:", err)
                );
            });
        });
      });
    });
  });
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});

ftpClient.connect({
  host: ftpCredentials.host,
  user: ftpCredentials.username,
  password: ftpCredentials.password,
});
