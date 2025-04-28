import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class CancelTabDTO{ 
  @IsOptional()
  @Transform(({ value }) =>  value === 'true')
  @IsBoolean()
  deleteTabItems: boolean
}