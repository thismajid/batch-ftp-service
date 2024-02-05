# Batch FTP Service

Batch FTP Service is a Node.js application that allows you to automate the batch processing of CSV files from an FTP server and insert them into a MongoDB database. It provides a convenient way to schedule and execute the batch processing task, ensuring the seamless integration of data from FTP to MongoDB.

## Features

- Connects to an FTP server and retrieves CSV files.
- Processes CSV files and inserts the data into a MongoDB database.
- Deletes the processed files from the FTP server.
- Creates an audit log for each successful batch processing task.
- Uses scheduling to automate the batch processing task at regular intervals.

## Configuration

Create a .env file in the root directory and set the following variables in the .env file:

```bash
FTP_HOST=ftp.example.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
FTP_DIRPATH=/csv/  # Optional: Set the directory path for CSV files, defaults to '/csv/'
MONGODB_URL=mongodb://localhost:27017/mydatabase  # Replace with your MongoDB connection URL
```

### Installation

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/thismajid/batch-ftp-service.git
cd batch-ftp-service
npm install
npm start |or| npm run dev
```
