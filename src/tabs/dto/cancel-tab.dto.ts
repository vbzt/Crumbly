import { IsBoolean } from "class-validator";

export class CancelTabDTO{ 

  @IsBoolean()
  deleteTabItems: boolean
}