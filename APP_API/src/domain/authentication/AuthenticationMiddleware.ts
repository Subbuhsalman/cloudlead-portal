import to from 'await-to-js';
import { z } from "zod";
import asyncHandler from 'express-async-handler';
import { validateOrReject, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import {
  BaseAuthenticationValidationSchema,
  GetAuthenticationValidationSchema,
  GetAuthenticationJWTValidationSchema

} from './AuthenticationValidator';

import { BadRequestException } from '../../shared/exceptions/http.exceptions';
import { isEmpty } from 'lodash';

export const getAuthenticationValidator = asyncHandler(async (
  req: Request,
  _: Response,
  next: NextFunction
) => {


  if (isEmpty(req?.body?.username))
    throw new BadRequestException('Required parameter "username" is missing! or empty');
  if (isEmpty(req?.body?.password))
    throw new BadRequestException('Required parameter "password" is missing! or empty');

  const credentials = new GetAuthenticationValidationSchema();
  credentials.username = String(req.body.username);

  credentials.password = String(req.body.password);

  await validateUserCredentials(credentials);

  next();
});

async function validateUserCredentials(credentials: BaseAuthenticationValidationSchema): Promise<void> {
  const [error] = await to(validateOrReject(credentials));

  if (error && error instanceof Array) {
    const err: ValidationError[] = error;
    const message = err[0].constraints ? Object.values(err[0].constraints)[0] : '';
    throw new BadRequestException(message);
  }
}

export const getGenerateTokenValidator = asyncHandler(async (
  req: Request,
  _: Response,
  next: NextFunction
) => {

  //  console.log('req?.body',req?.body?.userId)
  //   if (isEmpty(req?.body?.userId))
  //   {
  //     throw new BadRequestException('Required parameter "userId" is missing! or empty');
  //   }


  const user = new GetAuthenticationJWTValidationSchema();
  user.userId = Number(req.body.userId);

  await validateUserId(user);

  next();
});


async function validateUserId(user: BaseAuthenticationValidationSchema): Promise<void> {
  const [error] = await to(validateOrReject(user));

  if (error && error instanceof Array) {
    const err: ValidationError[] = error;
    const message = err[0].constraints ? Object.values(err[0].constraints)[0] : '';
    throw new BadRequestException(message);
  }
}



export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});