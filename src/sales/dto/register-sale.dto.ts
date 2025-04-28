import { IsInt } from "class-validator";

export class RegisterSaleDTO{ 
  @IsInt()
  tabId: number
}