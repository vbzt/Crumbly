import { IsBoolean, IsOptional } from "class-validator";

export class CancelTabDTO{ 
  @IsOptional()
  @IsBoolean()
  deleteTabItems: boolean
}