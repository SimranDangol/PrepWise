// Augment Express to recognize Multer's file types
import { Multer } from "multer";

declare global {
  namespace Express {
    // Augment the existing Multer File interface
    interface MulterFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
    }

    // Do not redeclare the files property to avoid type conflicts
  }
}

export interface MulterFiles {
  image?: Express.Multer.File[];
  resume?: Express.Multer.File[];
}


export {}; // Required to make this a module and avoid TS2306
