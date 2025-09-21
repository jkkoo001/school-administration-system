import {
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import TeacherStudentClassSubject from './TeacherStudentClassSubject';

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

  //  Define associations via TeacherStudentClassSubject
  @HasMany(() => TeacherStudentClassSubject)
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
