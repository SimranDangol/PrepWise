declare namespace Express {
  interface Request {
    file?: any;
    files?:
      | {
          [fieldname: string]: any[];
        }
      | any[];
  }
}
