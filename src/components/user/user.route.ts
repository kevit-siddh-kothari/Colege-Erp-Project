import { Router } from 'express';
import { authentication } from '../../middlewear/auth.middlewear'; // Fixed path to 'middleware'
import {authorization} from '../../middlewear/authorization.middlewear'
import { userController } from './user.controller';
import { handleValidationErrors } from '../../middlewear/handlevalidationerror.middlewear';
import { loginValidator, signUpValidator } from './user.validator';
import {checkForBufferData} from '../../middlewear/checkForBufferData.middlewear';

// Create a new Router instance
const userRouter = Router();

// Define routes
userRouter.post('/login', checkForBufferData,...loginValidator, handleValidationErrors, userController.logIn);

userRouter.post('/signup', checkForBufferData ,authentication, ...signUpValidator, handleValidationErrors, userController.signUp);

userRouter.post('/logout', checkForBufferData,authentication, userController.logOut);

userRouter.post('/logoutall', checkForBufferData,authentication,  userController.logOutFromAllDevices);

// Export the router
export { userRouter };
