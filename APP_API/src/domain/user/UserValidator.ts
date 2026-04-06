import {

  IsNotEmpty,
  IsNumber,
  IsString

  
} from 'class-validator';


/**
 * Base Class for Product validation
 */
export class BaseValidationSchema { }

export class GetUserValidationSchema extends BaseValidationSchema {

  @IsNotEmpty()
  @IsString()
  userId: String;

}

