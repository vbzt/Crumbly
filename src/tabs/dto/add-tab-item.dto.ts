import { IsInt, IsNumber, IsPositive } from "class-validator";


export class AddTabItemDTO{
  @IsInt()
  @IsPositive()
  productId: number

  @IsNumber({  allowNaN: false, allowInfinity: false })
  @IsPositive()
  quantity: number
}