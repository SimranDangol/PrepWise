import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      files?:
        | Multer.File[]
        | { [fieldname: string]: Multer.File[] }
        | undefined;
    }
  }
}
