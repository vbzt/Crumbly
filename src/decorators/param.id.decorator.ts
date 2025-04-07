import { createParamDecorator, ExecutionContext } from "@nestjs/common";

  export const ParamId = createParamDecorator( (args: string, context: ExecutionContext) => {
    if(!args) return Number( context.switchToHttp().getRequest().params.id)
    return Number( context.switchToHttp().getRequest().params[args])
  })