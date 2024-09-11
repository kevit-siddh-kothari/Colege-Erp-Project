import { param, body } from 'express-validator';

const getUserInformation = [
    param('username').notEmpty().isString().isEmail().withMessage(`Please Enter a valid username !`)
];

export {getUserInformation}