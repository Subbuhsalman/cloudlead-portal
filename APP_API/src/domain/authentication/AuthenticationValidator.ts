import {

  IsNotEmpty,
  IsNumber

  
} from 'class-validator';


/**
 * Base Class for Product validation
 */
export class BaseAuthenticationValidationSchema { }



export class GetAuthenticationValidationSchema extends BaseAuthenticationValidationSchema {

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

}

export class GetAuthenticationJWTValidationSchema extends BaseAuthenticationValidationSchema {

  @IsNotEmpty()
  @IsNumber()
  userId: number;

}
