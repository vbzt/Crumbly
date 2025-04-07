import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";


export class UpdateSaleItemDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number
}