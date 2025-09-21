import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import DataImportController from '../DataImportController';
import * as DataImportService from '../../services/DataImportService';
import * as Utils from '../../utils';

jest.mock('../../services/DataImportService');
jest.mock('../../utils');

const app = express();
app.use(express.json());
app.use('/', DataImportController);

describe('DataImportController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no file uploaded', async () => {
    const res = await request(app).post('/upload');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('File is required');
  });

  it('should return 400 for invalid file extension', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('data', Buffer.from('test'), 'file.txt'); // Invalid extension

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      'Invalid file type .txt, only .csv files are accepted'
    );
  });

  it('should process CSV file and return 204 on success', async () => {
    const parsedCsv = {
      teacherEmail: 'teacher1@email.com',
      teacherName: 'Teacher 1',
      studentEmail: 'student1@email.com',
      studentName: 'Student 1',
      classCode: '111',
      classname: 'Class 111',
      subjectCode: 'ENG',
      subjectName: 'English',
      toDelete: '0',
    };

    const convertToJsonSpy = jest.spyOn(Utils, 'convertCsvToJson');
    convertToJsonSpy.mockResolvedValue([parsedCsv]);

    const processCsvSpy = jest.spyOn(DataImportService, 'processCsvData');
    processCsvSpy.mockResolvedValue(undefined);

    const res = await request(app)
      .post('/upload')
      .attach('data', Buffer.from('test'), 'file.csv'); // Valid extension

    expect(convertToJsonSpy).toHaveBeenCalled();
    expect(processCsvSpy).toHaveBeenCalled();
    expect(res.status).toBe(204);
  });

  it('should call next with error if processing fails', async () => {
    const error = new Error('fail');
    const convertToJsonSpy = jest.spyOn(Utils, 'convertCsvToJson');
    convertToJsonSpy.mockRejectedValue(error);

    const next = jest.fn() as NextFunction;
    const req = { file: { path: 'file.csv', originalname: 'file.csv' } } as Request;
    const res = {} as Response;

    await DataImportController(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
