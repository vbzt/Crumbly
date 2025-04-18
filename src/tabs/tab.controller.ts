import { Controller, Get, Post } from "@nestjs/common";
import { TabService } from "./tab.service";
import { ParamId } from "src/decorators/param.id.decorator";
import { Employee } from "src/decorators/employee.decorator";


@Controller('tabs')
export class TabController {
  constructor ( private readonly tabService: TabService) {}

  @Get()
  async showTabs() { 
    return this.tabService.showTabs()
  }

  @Get('/:id')
  async getTab(@ParamId() id: number ){
  }

  @Post('/open')
  async openTab(@Employee('id') employeeId: number){ 
    
  }
}