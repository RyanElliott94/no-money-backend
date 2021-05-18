const express = require('express');
const { fetchFileFromToken } = require('../lib/db');
const { uploadMediaToS3 } = require('../middleware/mediaMiddleware');
const router = express.Router();

router.post("/upload-media-files", uploadMediaToS3, (req, res) => {
    if(req.error) {
        res.send({error: true, errorMessage: req.errDetail});
    }else{
        res.send({successful: true, fileData: req.mediaData, token: req.mediaData.token});
    }
});

router.get("/fetch-file-with-token/token/:token", fetchFileFromToken, (req, res) => {
    if(req.error) {
        res.send({error: true, errorMessage: req.errorMessage});
    }else{
        res.send({successful: true, fileLocation: req.fileLocation});
    }
});

module.exports = router;