  import { Type } from "class-transformer";
  import {IsNumber, Min } from "class-validator";


  export class UpdateSaleItemDTO {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    quantity: number
  }