import { Sequelize } from 'sequelize-typescript';
import Logger from './logger';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import Class from '../models/Class';
import Subject from '../models/Subject';
import TeacherStudentClassSubject from '../models/TeacherStudentClassSubject';

const LOG = new Logger(__filename);
const {
  DB_HOST = 'localhost',
  DB_PORT = '33306',
  DB_SCHEMA = 'school-administration-system',
  DB_USER = 'root',
  DB_PW = 'password',
  DB_POOL_ACQUIRE = '30000',
  DB_POOL_IDLE = '10000',
  DB_POOL_MAX_CONN = '10',
  DB_POOL_MIN_CONN = '1',
  DB_LOG_LEVEL = 'info',
} = process.env

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USER,
  password: DB_PW,
  database: DB_SCHEMA,
  models: [Teacher, Student, Class, Subject, TeacherStudentClassSubject],
  pool: {
    acquire: parseInt(DB_POOL_ACQUIRE),
    idle: parseInt(DB_POOL_IDLE),
    max: parseInt(DB_POOL_MAX_CONN),
    min: parseInt(DB_POOL_MIN_CONN)
  },
  timezone: '+08:00',
  logging: (msg) => {
    LOG.log(DB_LOG_LEVEL, msg);
  }
});

export default sequelize;

