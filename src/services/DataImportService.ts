import Logger from '../config/logger';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import Class from '../models/Class';
import Subject from '../models/Subject';
import TeacherStudentClassSubject from '../models/TeacherStudentClassSubject';
import { CsvItem } from 'CsvItem';

const LOG = new Logger(__filename);

//  Create new teacher or update teacher's name if same email found
export const createOrUpdateTeacher = async (
  email: string,
  name: string
): Promise<Teacher> => {
  try {
    const [teacherInstance, created] = await Teacher.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        name: name,
      },
    });

    if (created) {
      LOG.info(
        `Teacher ${teacherInstance.id} created with email ${email} and name ${name}`
      );
    }

    if (!created && teacherInstance.name !== name) {
      teacherInstance.name = name;
      await teacherInstance.save();
      LOG.info(`Teacher ${teacherInstance.id} updated with name ${name}`);
    }

    return teacherInstance;
  } catch (error) {
    LOG.error(`Failed to process teacher email ${email} and name ${name}: ${error}`);
  }
};

//  Create new student or update student's name if same email found
export const createOrUpdateStudent = async (
  email: string,
  name: string
): Promise<Student> => {
  try {
    const [studentInstance, created] = await Student.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        name: name,
      },
    });

    if (created) {
      LOG.info(
        `Student ${studentInstance.id} created with email ${email} and name ${name}`
      );
    }

    if (!created && studentInstance.name !== name) {
      studentInstance.name = name;
      await studentInstance.save();
      LOG.info(`Student ${studentInstance.id} updated with name ${name}`);
    }

    return studentInstance;
  } catch (error) {
    LOG.error(
      `Failed to process student email ${email} and name ${name}: ${error}`
    );
  }
};

//  Create new class or update class name if same code found
export const createOrUpdateClass = async (
  code: string,
  name: string
): Promise<Class> => {
  try {
    const [classInstance, created] = await Class.findOrCreate({
      where: {
        code: code,
      },
      defaults: {
        name: name,
      },
    });


    if (created) {
      LOG.info(
        `Class ${classInstance.id} created with code ${code} and name ${name}`
      );
    }

    if (!created && classInstance.name !== name) {
      classInstance.name = name;
      await classInstance.save();
      LOG.info(`Class ${classInstance.id} updated with name ${name}`);
    }

    return classInstance;
  } catch (error) {
    LOG.error(
      `Failed to process class code ${code} and name ${name}: ${error}`
    );
  }
};

//  Create new subject or update subject name if same code found
export const createOrUpdateSubject = async (
  code: string,
  name: string
): Promise<Subject> => {
  try {
    const [subjectInstance, created] = await Subject.findOrCreate({
      where: {
        code: code,
      },
      defaults: {
        name: name,
      },
    });

    if (created) {
      LOG.info(
        `Subject ${subjectInstance.id} created with code ${code} and name ${name}`
      );
    }

    if (!created && subjectInstance.name !== name) {
      subjectInstance.name = name;
      await subjectInstance.save();
      LOG.info(`Subject ${subjectInstance.id} updated with name ${name}`);
    }

    return subjectInstance;
  } catch (error) {
    LOG.error(
      `Failed to process subject code ${code} and name ${name}: ${error}`
    );
  }
};

export const processCsvRow = async (row: CsvItem): Promise<void> => {
  if (
    !row.teacherEmail ||
    !row.studentEmail ||
    !row.classCode ||
    !row.subjectCode
  ) {
    LOG.error(
      `Skipping row with missing mandatory fields: ${JSON.stringify(row)}`
    );
    return;
  }

  const teacherData = await createOrUpdateTeacher(
    row.teacherEmail,
    row.teacherName
  );

  const studentData = await createOrUpdateStudent(
    row.studentEmail,
    row.studentName
  );

  const classData = await createOrUpdateClass(
    row.classCode,
    row.classname
  );

  const subjectData = await createOrUpdateSubject(
    row.subjectCode,
    row.subjectName
  );

  if (!teacherData || !studentData || !classData || !subjectData) {
    LOG.error(`Failed to process row: ${JSON.stringify(row)}`);
    return;
  }

  if (row.toDelete === '1') {
    //  Delete associations
    const count = await TeacherStudentClassSubject.destroy({
      where: {
        teacherId: teacherData.id,
        studentId: studentData.id,
        classId: classData.id,
        subjectId: subjectData.id,
      },
    });

    count > 0
      ? LOG.info(
        `Successfully deleted association for teacher ${teacherData.id}, student ${studentData.id}, class ${classData.id} and subject ${subjectData.id}`
      )
      : LOG.info('No association deleted');
  } else {
    //  Create associations if not found
    const results = await TeacherStudentClassSubject.findOrCreate({
      where: {
        teacherId: teacherData.id,
        studentId: studentData.id,
        classId: classData.id,
        subjectId: subjectData.id,
      },
    });

    results[1]
      ? LOG.info(
        `Successfully created association for teacher ${teacherData.id}, student ${studentData.id}, class ${classData.id} and subject ${subjectData.id}`
      )
      : LOG.info('No new association created');
  }
};

export const processCsvData = async (data: CsvItem[]): Promise<void> => {
  for (const row of data) {
    await processCsvRow(row);
  }
};
