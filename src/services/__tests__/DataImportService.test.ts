import * as Service from '../DataImportService';
import Teacher from '../../models/Teacher';
import Student from '../../models/Student';
import Class from '../../models/Class';
import Subject from '../../models/Subject';
import TeacherStudentClassSubject from '../../models/TeacherStudentClassSubject';
import { CsvItem } from 'CsvItem';

jest.mock('../../models/Teacher');
jest.mock('../../models/Student');
jest.mock('../../models/Class');
jest.mock('../../models/Subject');
jest.mock('../../models/TeacherStudentClassSubject');

describe('DataImportService', () => {
  beforeEach(() => jest.clearAllMocks());

  const TeacherResponse = {
    id: 'a89f1a9c-b123-4a42-8796-a9644bcb21d2',
    email: 'teacher3@email.com',
    name: 'Teacher 3',
    createdAt: '2025-09-21 16:27:00',
    updatedAt: '2025-09-21 16:27:00',
  };

  it('should create a new teacher if not exists', async () => {
    const findOrCreateTeacherSpy = jest.spyOn(Teacher, 'findOrCreate');
    findOrCreateTeacherSpy.mockResolvedValue([TeacherResponse as unknown as Teacher, true]);

    const teacher = await Service.createOrUpdateTeacher(
      'teacher3@email.com',
      'Teacher 3'
    );
    expect(findOrCreateTeacherSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'teacher3@email.com' },
        defaults: { name: 'Teacher 3' },
      })
    );
    expect(teacher?.name).toBe('Teacher 3');
  });

  it('should update teacher name if changed', async () => {
    const saveMock = jest.fn();
    const findOrCreateTeacherSpy = jest.spyOn(Teacher, 'findOrCreate');
    findOrCreateTeacherSpy.mockResolvedValue([
      { ...TeacherResponse, save: saveMock } as unknown as Teacher,
      false,
    ]);

    const teacher = await Service.createOrUpdateTeacher(
      'teacher3@email.com',
      'New Teacher 3'
    );
    expect(saveMock).toHaveBeenCalled();
    expect(teacher?.name).toBe('New Teacher 3');
  });

  it('should delete association if toDelete=1', async () => {
    const destroyMock = jest.fn().mockResolvedValue(1);
    (Teacher.findOrCreate as jest.Mock).mockResolvedValue([
      { id: 1, save: jest.fn() },
      true,
    ]);
    (Student.findOrCreate as jest.Mock).mockResolvedValue([
      { id: 2, save: jest.fn() },
      true,
    ]);
    (Class.findOrCreate as jest.Mock).mockResolvedValue([
      { id: 3, save: jest.fn() },
      true,
    ]);
    (Subject.findOrCreate as jest.Mock).mockResolvedValue([
      { id: 4, save: jest.fn() },
      true,
    ]);
    (TeacherStudentClassSubject.destroy as jest.Mock).mockImplementation(
      destroyMock
    );

    const row = {
      teacherEmail: 'a@b.com',
      teacherName: 'A',
      studentEmail: 's@b.com',
      studentName: 'S',
      classCode: 'C1',
      classname: 'Class 1',
      subjectCode: 'Sub1',
      subjectName: 'Subject 1',
      toDelete: '1',
    };

    await Service.processCsvRow(row as unknown as CsvItem);
    expect(destroyMock).toHaveBeenCalledWith({
      where: { teacherId: 1, studentId: 2, classId: 3, subjectId: 4 },
    });
  });
});
