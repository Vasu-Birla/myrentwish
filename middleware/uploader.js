import * as path from 'path';
import multer from 'multer';

// Define storage for uploaded images
const imageStorage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    console.log("imageUpload API Hited");
    const img = file.originalname;
    const timestamp = Date.now();
    const extname = path.extname(file.originalname);
    const imageName = `img_${img}_${timestamp}${extname}`;
    cb(null, imageName);
  }
});

// Create multer instance for image uploads
const imageUpload = multer({ 
  storage: imageStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept image files
    } else {
      cb(new Error('File type not allowed. Please upload an image.'), false);
    }
  },
});

// Define storage for general file uploads
const fileStorage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    console.log("fileUpload API Hited");
    const timestamp = Date.now();
    const extname = path.extname(file.originalname);
    const fileName = `file_${timestamp}${extname}`;
    cb(null, fileName);
  }
});

// Create multer instance for general file uploads
const fileUpload = multer({ storage: fileStorage });

export { imageUpload, fileUpload };
