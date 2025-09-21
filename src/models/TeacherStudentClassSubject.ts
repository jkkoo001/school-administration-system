import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Teacher from './Teacher';
import Class from './Class';
import Subject from './Subject';
import Student from './Student';

//  Full attributes of TeacherStudentClassSubject model
export interface TeacherStudentClassSubjectAttributes {
  id: string;
  teacherId: string;
  studentId: string;
  classId: string;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
}

//  Attributes required during teacher-student-class-subject creation
export interface TeacherStudentClassSubjectCreationAttributes {
  teacherId: string;
  studentId: string;
  classId: string;
  subjectId: string;
}

@Table({
  tableName: 'teachers_students_classes_subjects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['teacherId', 'studentId', 'classId', 'subjectId'], //  Composite unique constraint
    },
  ],
})
export default class TeacherStudentClassSubject extends Model<
  TeacherStudentClassSubjectAttributes,
  TeacherStudentClassSubjectCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, //  Auto generate UUID
  })
  public id!: string;

  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.UUID,
    field: 'teacherId',
    allowNull: false,
  })
  public teacherId!: string;

  @BelongsTo(() => Teacher, 'teacherId')
  public teachers!: Teacher;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    field: 'studentId',
    allowNull: false,
  })
  public studentId!: string;

  @BelongsTo(() => Student, 'studentId')
  public students!: Student;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.UUID,
    field: 'classId',
    allowNull: false,
  })
  public classId!: string;

  @BelongsTo(() => Class, 'classId')
  public classes!: Class;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
    field: 'subjectId',
    allowNull: false,
  })
  public subjectId!: string;

  @BelongsTo(() => Subject, 'subjectId')
  public subjects!: Subject;
}
