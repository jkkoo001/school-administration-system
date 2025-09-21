import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import TeacherStudentClassSubject from './TeacherStudentClassSubject';
import Class from './Class';
import Teacher from './Teacher';
import Student from './Student';

//  Full attributes of Subject model
export interface SubjectAttributes {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

//  Attributes required during subject creation
export interface SubjectCreationAttributes {
  code: string;
  name: string;
}

@Table({
  tableName: 'subjects',
  timestamps: true,
})
export default class Subject extends Model<
  SubjectAttributes,
  SubjectCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, //  Auto generate UUID
  })
  public id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  public code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public name!: string;

  //  Many-to-many with Teachers through TeacherStudentClassSubject
  @BelongsToMany(() => Teacher, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'subjectId',
    otherKey: 'teacherId',
    as: 'teachers',
  })
  public teachers!: Teacher[];

  //  Many-to-many with Students through TeacherStudentClassSubject
  @BelongsToMany(() => Student, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'subjectId',
    otherKey: 'studentId',
    as: 'students',
  })
  public students!: Student[];

  //  Many-to-many with Classes through TeacherStudentClassSubject
  @BelongsToMany(() => Class, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'subjectId',
    otherKey: 'classId',
    as: 'classes',
  })
  public classes!: Class[];

  //  Direct access to junction table
  @HasMany(() => TeacherStudentClassSubject, 'subjectId')
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
