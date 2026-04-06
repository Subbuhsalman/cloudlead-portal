import to from 'await-to-js';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  BaseValidationSchema,
  GetAdminUserValidationSchema,
} from './AdminUserValidator';

import { BadRequestException } from '../../shared/exceptions/http.exceptions';

export const getAdminUserValidator = asyncHandler(async (
  req: Request,
  _: Response,
  next: NextFunction
) => {


  // if (isEmpty(req?.body?.userId))
  //   throw new BadRequestException('Required parameter "userId" is missing! or empty');


  const input = new GetAdminUserValidationSchema();
  input.admin_user_id = String(req.body.admin_user_id);



  await validateAdminUser(input);

  next();
});

async function validateAdminUser(credentials: BaseValidationSchema): Promise<void> {
  const [error] = await to(validateOrReject(credentials));

  if (error && error instanceof Array) {
    const err: ValidationError[] = error;
    const message = err[0].constraints ? Object.values(err[0].constraints)[0] : '';
    throw new BadRequestException(message);
  }
}

