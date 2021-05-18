const jwt = require('jsonwebtoken');
const { connection, createAccessToken } = require('../lib/db');
require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    secretAccessKey: process.env.S3_SECRET_KEY,
    accessKeyId: process.env.S3_ACCESS_ID,
    region: process.env.S3_REGION
})
const s3 = new AWS.S3();

const uploadMediaToS3 = (req, res, next) => {
    const mediaData = req.files.fileData;

    const mediaParams = {
        ACL: "public-read",
        Body: mediaData.data,
        Bucket: `${process.env.S3_STORAGE_BUCKET}/`,
        Key: mediaData.name
    };

    s3.upload(mediaParams, {partSize: 1024 * 1024 * 25}, (err, data) => {
        if(err) {
            req.error = true;
            req.errDetail = err.stack;
            next();
        }else if(data) {
            const fileToken = createAccessToken({
                fileLocation: data.Location
            });
            req.mediaUploaded = true;
            req.mediaData = {token: fileToken, data: data};
            next();
        }
    });
}

module.exports = {
    uploadMediaToS3
}