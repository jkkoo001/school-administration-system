import axios from 'axios';
import Student from '../models/Student';
import Class from '../models/Class';
import Logger from '../config/logger';
import ErrorBase from '../errors/ErrorBase';
import ErrorCodes from '../const/ErrorCodes';
import { StudentData } from 'StudentType';

const LOG = new Logger(__filename);

export const getStudentsByClass = async (
  classCode: string,
  offset: number,
  limit: number
): Promise<{
  count: number;
  students: StudentData[]
}> => {
  try {
    // Fetch internal students
    const internalStudents = await Student.findAll({
      include: [
        {
          model: Class,
          where: { code: classCode },
          through: { attributes: [] }, //  Do not include attributes from join table
        },
      ],
    });

    const formattedInternal: StudentData[] = internalStudents.map(
      (student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
      })
    );

    // Fetch external students
    const externalStudentUrl = 'http://localhost:5000/students';

    LOG.info(`Fetching external students from ${externalStudentUrl}`);

    const externalResponse = await axios.get(externalStudentUrl, {
      params: { class: classCode, offset, limit },
    });
    const externalStudents = externalResponse?.data.students || [];

    if (externalStudents.length === 0) {
      LOG.info(`No external student retrieved for class ${classCode}`);
    }

    const combinedStudents = [...formattedInternal, ...externalStudents].sort(
      (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) //  undefined locale to use default runtime locale; sensitivity base to ignore case and accent
    );

    const paginatedData = combinedStudents.slice(offset, offset + limit);

    return {
      count: combinedStudents.length,
      students: paginatedData,
    };
  } catch (error) {
    LOG.error(`Failed to get students listing ${error.message}`);
    throw new ErrorBase(
      'Failed to fetch students',
      ErrorCodes.RUNTIME_ERROR_CODE,
      500
    );
  }
};
