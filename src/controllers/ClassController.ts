import { Router, Request, Response } from 'express';
import { getStudentsByClass } from '../services/StudentListingService';
import { body, param, query } from 'express-validator';
import { updateClassName } from '../services/UpdateClassService';
import { handleValidationErrors } from '../middlewares/requestValidation';

const ClassController = Router();

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

ClassController.get(
  '/class/:classCode/students',
  [
    param('classCode')
      .isString()
      .withMessage('classCode must be a string')
      .notEmpty()
      .withMessage('classCode is required'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('offset must be a non-negative number'),
    query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('limit must be a positive number'),
    handleValidationErrors
  ],
  async (req: Request, res: Response) => {
    try {
      const { classCode } = req.params;
      const offset = parseInt(req.query.offset as string) || DEFAULT_OFFSET;
      const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

      const result = await getStudentsByClass(classCode, offset, limit);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

ClassController.put(
  '/class/:classCode',
  [
    param('classCode')
      .notEmpty()
      .withMessage('Class code is required')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Class code must be between 1 and 50 characters'),
    body('className')
      .isString()
      .withMessage('Class name must be string')
      .notEmpty()
      .withMessage('Class name is required')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Class name must be between 1 and 255 characters'),
    handleValidationErrors,
  ],
  async (req: Request, res: Response) => {
    try {
      const { classCode } = req.params;
      const { className } = req.body;

      await updateClassName(classCode, className);

      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default ClassController;
