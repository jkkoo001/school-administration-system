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
import Subject from './Subject';
import Class from './Class';
import Student from './Student';

//  Full attributes of Teacher model
export interface TeacherAttributes {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

//  Attributes required during teacher creation
export interface TeacherCreationAttributes {
  email: string;
  name: string;
}

@Table({
  tableName: 'teachers',
  timestamps: true,
})
export default class Teacher extends Model<
  TeacherAttributes,
  TeacherCreationAttributes
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
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public name!: string;

  //  Many-to-many with Students through TeacherStudentClassSubject
  @BelongsToMany(() => Student, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'teacherId',
    otherKey: 'studentId',
    as: 'students',
  })
  public students!: Student[];

  //  Many-to-many with Classes through TeacherStudentClassSubject
  @BelongsToMany(() => Class, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'teacherId',
    otherKey: 'classId',
    as: 'classes',
  })
  public classes!: Class[];

  //  Many-to-many with Subjects through TeacherStudentClassSubject
  @BelongsToMany(() => Subject, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'teacherId',
    otherKey: 'subjectId',
    as: 'subjects',
  })
  public subjects!: Subject[];

  //  Direct access to junction table
  @HasMany(() => TeacherStudentClassSubject, 'teacherId')
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
