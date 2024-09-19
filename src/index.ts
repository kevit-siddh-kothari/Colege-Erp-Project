import dotenv from 'dotenv';
import express, { Application } from 'express';
import { connectionToDb } from './db-connection/mongodb-connection';
import { studentRouter } from './components/student/student.route';
import { userRouter } from './components/user/user.route';
import { departmentRouter } from './components/department/department.route';
import { attendanceRouter } from './components/attendance/attendance.route';
import { batchRouter } from './components/batch/batch.route';
import { authentication } from './middlewear/auth.middlewear';
import { authorization } from './middlewear/authorization.middlewear';
import { studentInfRouter } from './components/studentInf/studentInf.route';
import bodyParser from 'body-parser';

dotenv.config();

const connectionUrl: string = process.env.MONGODB_URL as string;

const port: string| undefined = process.env.PORT || undefined;

/**
 * Connect to the MongoDB database using the provided connection URL.
 *
 * @param {string} connectionUrl - The connection string for the MongoDB database.
 */
connectionToDb(connectionUrl);

const app: Application = express();

/*******************************
 * MIDDLEWARE - FOR PARSING USER DATA TO JSON
 *******************************/
app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*******************************
 * MIDDLEWARE - ROUTES
 *******************************/
app.use('/api/user', authentication, authorization.authorizationSuperAdmin , userRouter);
app.use('/api/students', authentication,authorization.authorizationAdminOrStaff, studentRouter);
app.use('/api/departments', authentication, authorization.authorizationAdmin, departmentRouter);
app.use('/api/attendance', authentication, authorization.authorizationAdminOrStaff, attendanceRouter);
app.use('/api/batch', authentication, authorization.authorizationAdmin, batchRouter);
app.use('/student', authentication, authorization.authorizationStudent, studentInfRouter);

export { app, port };
