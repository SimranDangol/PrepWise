// Fix for Node.js built-ins
declare module 'crypto';
declare module 'fs';
declare module 'path';
declare module 'process';

// Fix for 3rd-party modules (if TypeScript still complains)
declare module 'bcrypt';
declare module 'jsonwebtoken';
declare module 'multer';
declare module 'nodemailer';