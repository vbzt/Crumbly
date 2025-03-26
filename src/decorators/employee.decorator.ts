import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const Employee = createParamDecorator((args: string, context: ExecutionContext) => { 
  const request = context.switchToHttp().getRequest()
  const employee = request.employeeData
  if(!employee) throw new NotFoundException('Employee not found')
  if(args) return employee[args]
  return employee
})