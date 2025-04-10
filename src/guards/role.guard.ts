import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/enum/role.enum";


@Injectable()
export class RoleGuard implements CanActivate{ 
  constructor( private readonly reflector: Reflector){}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
    if(!requiredRoles) return true 

    const { employeeData } = context.switchToHttp().getRequest()

    const filteredRoles = requiredRoles.filter(filter => filter === employeeData.role)
    return filteredRoles.length > 0 
  }

}