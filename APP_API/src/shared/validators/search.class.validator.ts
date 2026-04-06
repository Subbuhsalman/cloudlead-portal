import {
  IsInt,
  Length,
  IsUrl,
  IsDate,
  Min,
  Max,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsAlphanumeric,
  IsAlpha
} from 'class-validator';


/**
 * Base Class for Product validation
 */
export class BaseSearchValidationSchema { }



export class GetSearchNameValidationSchema extends BaseSearchValidationSchema {
  @IsAlphanumeric()

  companyName: string;

  // @IsNumber()
  
  // page: number;

  // @IsAlpha()
  // @Min(2)
  // @Max(2)
  // lang: string;
}
