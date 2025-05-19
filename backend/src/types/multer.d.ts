// Remove the Multer import and use direct types
import "multer"; // This ensures the types are loaded

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?:
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[];
    }
  }
}
