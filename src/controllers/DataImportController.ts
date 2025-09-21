import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from '../utils';
import path from 'path';
import { processCsvData } from '../services/DataImportService';
import { ALLOWED_FILE_EXT } from '../const/FileConstants';

const DataImportController = Express.Router();
const LOG = new Logger(__filename);

const validateUpload: RequestHandler = (req, res, next) => {
  const { file } = req;

  if (!file) {
    LOG.error('File is required');
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is required' });
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ALLOWED_FILE_EXT) {
    LOG.error(
      `Invalid file type ${ext}, only ${ALLOWED_FILE_EXT} files are accepted`
    );
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: `Invalid file type ${ext}, only ${ALLOWED_FILE_EXT} files are accepted`,
      });
  }

  next();
};

const dataImportHandler: RequestHandler = async (req, res, next) => {
  try {
    const { file } = req;
    const data = await convertCsvToJson(file.path);

    LOG.info(`Processing ${data.length} rows from CSV file`);

    await processCsvData(data);

    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    LOG.error(`Failed to process CSV file: ${error}`);
    next(error);
  }
};

DataImportController.post('/upload', upload.single('data'), validateUpload, dataImportHandler);

export default DataImportController;
