import { IsInt, IsNumber, IsPositive, Min } from "class-validator";


export class AddTabItemDTO{
  @IsInt()
  @IsPositive()
  productId: number

  @IsNumber({  allowNaN: false, allowInfinity: false })
  @Min(0.01)
  quantity: number
}