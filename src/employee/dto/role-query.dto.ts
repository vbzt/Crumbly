import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { Role } from "src/enum/role.enum";

export class RoleQueryDTO{ 
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(Role)
  role: Role
}