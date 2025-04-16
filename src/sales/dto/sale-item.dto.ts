import { IsInt, IsNumber, IsPositive, Min } from "class-validator";

export class SaleItemDTO{ 
    @IsInt()
    @IsPositive()
    product_id: number;
    
    
    @IsNumber({  allowNaN: false, allowInfinity: false })
    @Min(0.01)
    quantity: number;
}