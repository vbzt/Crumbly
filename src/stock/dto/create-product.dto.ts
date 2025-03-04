
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { UOM } from "src/enum/unit-of-measurement.enum";


export class CreateProductDTO{ 

  @IsString()
  name:string

  @IsNumber({maxDecimalPlaces: 2})
  @Min(0)
  price: number

  @IsString()
  category: string

  @IsNumber()
  @Min(0)
  amount: number

  @IsEnum(UOM)
  unit_of_measurement: string

}