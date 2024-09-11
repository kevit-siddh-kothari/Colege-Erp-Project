import { Router } from 'express';
import { student } from './studentinf.controller';
import { getUserInformation } from './studentInf.validator'
import { handleValidationErrors } from '../../middlewear/handlevalidationerror.middlewear';

const studentInfRouter = Router();

studentInfRouter.get('/getInformation/:username',...getUserInformation,handleValidationErrors,student.studentInf);

export { studentInfRouter };
