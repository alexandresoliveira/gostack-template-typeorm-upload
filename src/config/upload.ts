import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  storage: multer.diskStorage({
    destination: tmpDirectory,
    filename(request, file, callback) {
      const suffix = crypto.randomBytes(10).toString('HEX');
      const fileName = `${suffix}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
