import { Request, Response, Router } from 'express';
import { generateWorkloadReport } from '../services/WorkloadService';

const ReportController = Router();

ReportController.get(
  '/reports/workload',
  async (req: Request, res: Response) => {
    try {
      const workloadReport = await generateWorkloadReport();
      return res.status(200).json(workloadReport);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export default ReportController;
