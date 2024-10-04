import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import {validateAddAttendance, validateUpdateAttendance} from './attendance.validator';
import {handleValidationErrors} from '../../middlewear/handlevalidationerror.middlewear';
const attendanceRouter = Router();

attendanceRouter.get('/all-attendance', attendanceController.getAllStudentAttendance);
attendanceRouter.post('/add-attendance/:id', ...validateAddAttendance, handleValidationErrors, attendanceController.addAttendance);
attendanceRouter.put('/update-attendance/:id/:date',...validateUpdateAttendance, handleValidationErrors, attendanceController.updateAttendance);

export { attendanceRouter };
