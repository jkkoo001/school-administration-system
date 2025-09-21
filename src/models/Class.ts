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
import Student from './Student';
import Teacher from './Teacher';
import Subject from './Subject';

//  Full attributes of Class model
export interface ClassAttributes {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

//  Attributes required during class creation
export interface ClassCreationAttributes {
  code: string;
  name: string;
}

@Table({
  tableName: 'classes',
  timestamps: true,
})
export default class Class extends Model<
  ClassAttributes,
  ClassCreationAttributes
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
    foreignKey: 'classId',
    otherKey: 'teacherId',
    as: 'teachers',
  })
  public teachers!: Teacher[];

  //  Many-to-many with Students through TeacherStudentClassSubject
  @BelongsToMany(() => Student, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'classId',
    otherKey: 'studentId',
    as: 'students',
  })
  public students!: Student[];

  //  Many-to-many with Subjects through TeacherStudentClassSubject
  @BelongsToMany(() => Subject, {
    through: () => TeacherStudentClassSubject,
    foreignKey: 'classId',
    otherKey: 'subjectId',
    as: 'subjects',
  })
  public subjects!: Subject[];

  //  Direct access to junction table
  @HasMany(() => TeacherStudentClassSubject, 'classId')
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
