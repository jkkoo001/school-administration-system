import request from 'supertest';
import express from 'express';
import ReportController from '../ReportController';
import * as Service from '../../services/WorkloadService';

jest.mock('../../services/WorkloadService');

const app = express();
app.use('/', ReportController);

describe('ReportController', () => {
  describe('GET /reports/workload', () => {
    it('should return workload report with status 200', async () => {
      const mockReport = {
        'Teacher 1': [
          {
            subjectCode: 'MATHS',
            subjectName: 'Mathematics',
            numberOfClasses: 1,
          },
          {
            subjectCode: 'SC',
            subjectName: 'Science',
            numberOfClasses: 1,
          },
        ],
      };
      const generateReportSpy = jest.spyOn(Service, 'generateWorkloadReport');
      generateReportSpy.mockResolvedValue(mockReport);

      const res = await request(app).get('/reports/workload');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReport);
      expect(generateReportSpy).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if service throws an error', async () => {
      const generateReportSpy = jest.spyOn(Service, 'generateWorkloadReport');
      generateReportSpy.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/reports/workload');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
