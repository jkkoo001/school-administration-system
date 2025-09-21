import request from 'supertest';
import express from 'express';
import ClassController from '../ClassController';
import * as ListService from '../../services/StudentListingService';
import * as UpdateService from '../../services/UpdateClassService';

jest.mock('../../services/StudentListingService');
jest.mock('../../services/UpdateClassService');

const app = express();
app.use(express.json());
app.use('/', ClassController);

describe('ClassController', () => {
  describe('GET /class/:classCode/students', () => {
    const mockStudentResponse = {
      count: 1,
      students: [
        {
          id: '233d9722-de0e-426f-8d79-4be4d0705c67',
          name: 'Alice',
          email: 'alice@email.com',
        },
      ],
    };

    it('should return students with default offset and limit', async () => {
      const getStudentListSpy = jest.spyOn(ListService, 'getStudentsByClass');
      getStudentListSpy.mockResolvedValue(mockStudentResponse);

      const res = await request(app).get('/class/ABC123/students');

      expect(res.status).toBe(200);
      expect(getStudentListSpy).toHaveBeenCalledWith('ABC123', 0, 10);
      expect(res.body).toEqual(mockStudentResponse);
    });

    it('should return students with custom offset and limit', async () => {
      const getStudentListSpy = jest.spyOn(ListService, 'getStudentsByClass');
      getStudentListSpy.mockResolvedValue(mockStudentResponse);
      getStudentListSpy.mockResolvedValue(mockStudentResponse);

      const res = await request(app).get(
        '/class/XYZ999/students?offset=5&limit=20'
      );

      expect(res.status).toBe(200);
      expect(getStudentListSpy).toHaveBeenCalledWith('XYZ999', 5, 20);
      expect(res.body).toEqual(mockStudentResponse);
    });

    it('should return 400 if classCode is missing', async () => {
      const res = await request(app).get('/class//students');

      expect(res.status).toBe(404);
    });

    it('should return 400 if limit is invalid', async () => {
      const res = await request(app).get('/class/ABC123/students?limit=0');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /class/:classCode', () => {
    it('should update class name and return 204', async () => {
      const updateClassSpy = jest
        .spyOn(UpdateService, 'updateClassName')
        .mockResolvedValue(undefined);

      const res = await request(app)
        .put('/class/ABC123')
        .send({ className: 'New Class Name' });

      expect(res.status).toBe(204);
      expect(updateClassSpy).toHaveBeenCalledWith('ABC123', 'New Class Name');
    });

    it('should return 400 if className is missing', async () => {
      const res = await request(app).put('/class/ABC123').send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 if classCode is too long', async () => {
      const longCode = 'X'.repeat(51);

      const res = await request(app)
        .put(`/class/${longCode}`)
        .send({ className: 'Valid Name' });

      expect(res.status).toBe(400);
    });
  });
});
