import { Type } from "class-transformer";
import { IsArray, IsInt, IsPositive, ValidateNested } from "class-validator";
import { SaleItemDTO } from "./sale-item.dto";


export class RegisterSaleDTO{ 
  @IsArray()
  @ValidateNested( { each: true } )
  @Type(() => SaleItemDTO)
  saleItems: SaleItemDTO[]
}