import to from 'await-to-js';
import asyncHandler from 'express-async-handler';
import { validateOrReject, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import {
  BaseValidationSchema,
  GetUserValidationSchema,

} from './UserValidator';

import { BadRequestException } from '../../shared/exceptions/http.exceptions';
import { isEmpty } from 'lodash';

export const getUserValidator = asyncHandler(async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  
 
  // if (isEmpty(req?.body?.userId))
  //   throw new BadRequestException('Required parameter "userId" is missing! or empty');
  

  const input = new GetUserValidationSchema();
  input.userId = String(req.body.userId);



  await validateUser(input);

  next();
});

async function validateUser(credentials: BaseValidationSchema): Promise<void> {
  const [error] = await to(validateOrReject(credentials));

  if (error && error instanceof Array) {
    const err: ValidationError[] = error;
    const message = err[0].constraints ? Object.values(err[0].constraints)[0] : '';
    throw new BadRequestException(message);
  }
}

