// // src/types/multer.d.ts
// import "multer"; // This ensures Multer types are loaded

// declare global {
//   namespace Express {
//     // This merges with the existing Express types
//     interface Request {
//       file?: Multer.File;
//       files?:
//         | {
//             [fieldname: string]: Multer.File[];
//           }
//         | Multer.File[];
//     }
//   }
// }


import * as Express from 'express';
import multer from 'multer';

// Use the correct approach for working with multer types
declare module 'express' {
  export interface Request {
    file?: any;
    files?: {
      [fieldname: string]: any[];
    } | any[];
  }
}

// Export an empty object to make this a module
export {};