import { QueryTypes } from 'sequelize';
import Teacher from '../models/Teacher'; // To access sequelize instance
import Logger from '../config/logger';
import ErrorBase from '../errors/ErrorBase';
import ErrorCodes from '../const/ErrorCodes';

const LOG = new Logger(__filename);

export interface rowData {
  teacherName: string;
  subjectCode: string;
  subjectName: string;
  numberOfClasses: string;
}

export interface WorkloadData {
  subjectCode: string;
  subjectName: string;
  numberOfClasses: number;
}

export interface WorkloadReport {
  [teacherName: string]: WorkloadData[];
}

export const generateWorkloadReport = async (): Promise<WorkloadReport> => {
  try {
    LOG.info('Generating workload report');

    // Raw SQL query to get workload data
    const query = `
      SELECT
        t.name as teacherName,
        s.code as subjectCode,
        s.name as subjectName,
        COUNT(DISTINCT c.id) as numberOfClasses
      FROM teachers_students_classes_subjects tscs
      INNER JOIN teachers t ON tscs.teacherId = t.id
      INNER JOIN subjects s ON tscs.subjectId = s.id
      INNER JOIN classes c ON tscs.classId = c.id
      GROUP BY t.name, s.code, s.name
      ORDER BY t.name, s.code
    `;

    const results: rowData[] = await Teacher.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    //  Transform results into the required format
    const workloadReport: WorkloadReport = {};

    results.forEach(
      (row: rowData) => {
        const { teacherName, subjectCode, subjectName, numberOfClasses } = row;

        if (!workloadReport[teacherName]) {
          workloadReport[teacherName] = [];
        }

        workloadReport[teacherName].push({
          subjectCode,
          subjectName,
          numberOfClasses: parseInt(numberOfClasses),
        });
      }
    );

    LOG.info(
      `Generated workload report for ${
        Object.keys(workloadReport).length
      } teachers`
    );
    return workloadReport;
  } catch (error) {
    LOG.error(`Failed to generate workload report: ${error}`);
    throw new ErrorBase(
      'Failed to generate workload report',
      ErrorCodes.RUNTIME_ERROR_CODE,
      500
    );
  }
};
