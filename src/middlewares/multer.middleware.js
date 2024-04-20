// multer - it is used to upload the file to the server for a brief period of time before uploading it to cloudinary.

import multer from "multer";

const storageDisk = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../public/temp");
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);  // For unique file name, the generated value is attached with the file name in thee back.

        cb(null, file.originalname);   // file.originalname is the original file name of the uploaded file. we can also keep our own file name.
    }
});

export const upload = multer({
    storage: storageDisk
});