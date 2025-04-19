import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common'

export const ParamId = createParamDecorator((args: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  const param = args ? request.params[args] : request.params.id
  const parsedId = Number(param)

  if (isNaN(parsedId) || parsedId < 1) {
    throw new BadRequestException('Invalid ID')
  }

  return parsedId
})
