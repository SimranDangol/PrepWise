// src/types/multer.d.ts
import "multer"; // This ensures Multer types are loaded

declare global {
  namespace Express {
    // This merges with the existing Express types
    interface Request {
      file?: Multer.File;
      files?:
        | {
            [fieldname: string]: Multer.File[];
          }
        | Multer.File[];
    }
  }
}

