import { Transform, Type } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { TabStatus } from '../../enum/tab-status.enum'

export class TabQueryStatusDTO {
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(TabStatus)
  status: TabStatus
}