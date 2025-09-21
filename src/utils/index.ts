import fs from 'fs';
import csv from 'csv-parser';
import { CsvItem } from 'CsvItem';
import Logger from '../config/logger';

const LOG = new Logger(__filename);

const deleteFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) {
      LOG.error(`Failed to delete CSV file ${path}: ${err}`);
    }
  });
};

export const convertCsvToJson = async (filePath: string): Promise<CsvItem[]> => {
  const results: CsvItem[] = [];
  const stream = fs.createReadStream(filePath).pipe(csv());

  return new Promise((resolve, reject) => {
    stream.on('data', (data: CsvItem) => results.push(data));
    stream.on('end', () => {
      LOG.info(`Successfully parsed CSV file: ${filePath}`);
      resolve(results);
      deleteFile(filePath);
    });
    stream.on('error', (error) => {
      LOG.error(`Error parsing CSV file: ${filePath} ${error}`);
      deleteFile(filePath);
      reject(error);
    });
  });
};
