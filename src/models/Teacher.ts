import {
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import TeacherStudentClassSubject from './TeacherStudentClassSubject';

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

  //  Define associations via TeacherStudentClassSubject
  @HasMany(() => TeacherStudentClassSubject)
  public teacherStudentClassSubjects!: TeacherStudentClassSubject[];
}
