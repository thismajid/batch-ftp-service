import dotenv from "dotenv";

dotenv.config();

export const ftpCredentials = {
  host: process.env.FTP_HOST,
  username: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  dirPath: process.env.FTP_DIRPATH || "/csv/",
};

export const mongodbUrl = process.env.MONGODB_URL;
