import multer from 'multer';
import { MAX_FILE_SIZE_MB } from '../const/FileConstants';

const diskStorage = multer.diskStorage({
  destination: '/tmp/school-administration-system-uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, //  Converts mb to bytes
  }
});

export default upload;
