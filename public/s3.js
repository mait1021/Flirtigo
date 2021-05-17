const S3 = require("aws-sdk/clients/s3");
require("dotenv").config();
const fs = require("fs");
var multer = require("multer");
var multerS3 = require("multer-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const upload_to_s3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
  // s3.upload(uploadParams, function (err, data) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(data);
  //   console.log(`File uploaded successfully. ${data.Location}`);
  //   return data;
  // });
}

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream;
}

exports.uploadFile = uploadFile;
exports.getFileStream = getFileStream;
module.exports = upload_to_s3;
