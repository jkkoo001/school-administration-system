import {
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import TeacherStudentClassSubject from './TeacherStudentClassSubject';

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

  //  Define associations via TeacherStudentClassSubject
  @HasMany(() => TeacherStudentClassSubject)
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
