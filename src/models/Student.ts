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
import Teacher from './Teacher';
import Class from './Class';
import Subject from './Subject';

//  Full attributes of Student model
export interface StudentAttributes {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

//  Attributes required during student creation
export interface StudentCreationAttributes {
  email: string;
  name: string;
}

@Table({
  tableName: 'students',
  timestamps: true,
})
export default class Student extends Model<
  StudentAttributes,
  StudentCreationAttributes
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

  //  Many-to-many with Teachers through TeacherStudentClassSubject
  @BelongsToMany(() => Teacher, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'studentId',
    otherKey: 'teacherId',
    as: 'teachers',
  })
  public teachers!: Teacher[];

  //  Many-to-many with Classes through TeacherStudentClassSubject
  @BelongsToMany(() => Class, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'studentId',
    otherKey: 'classId',
    as: 'classes',
  })
  public classes!: Class[];

  //  Many-to-many with Subjects through TeacherStudentClassSubject
  @BelongsToMany(() => Subject, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'studentId',
    otherKey: 'subjectId',
    as: 'subjects',
  })
  public subjects!: Subject[];

  //  Direct access to junction table
  @HasMany(() => TeacherStudentClassSubject, 'studentId')
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
