  import { Type } from "class-transformer";
  import { IsNumber, IsPositive } from "class-validator";


  export class UpdateSaleItemDTO {
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    quantity: number
  }