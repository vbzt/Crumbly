import { IsInt, IsNumber, IsPositive, Min } from "class-validator";


  export class EditTabItemDTO{
    @IsNumber({  allowNaN: false, allowInfinity: false })
    @Min(0)
    quantity: number;

    @IsInt()
    @IsPositive() 
    productId: number;
  }