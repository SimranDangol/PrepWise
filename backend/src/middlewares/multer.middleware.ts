// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf') {
//       return cb(new Error('Only images and PDF files are allowed'));
//     }
//     cb(null, true);
//   },
// });

import multer from "multer";
import { Request } from "express";
import path from "path";
import { MulterFile } from "../controllers/auth.controller";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req: Request, file: any, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req: Request, file: any, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".pdf") {
      return cb(new Error("Only images and PDF files are allowed"));
    }
    cb(null, true);
  },
});
