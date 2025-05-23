import { Body, Controller, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TabService } from "./tab.service";
import { ParamId } from "src/decorators/param.id.decorator";
import { Employee } from "src/decorators/employee.decorator";
import { CancelTabDTO } from "./dto/cancel-tab.dto";
import { AddTabItemDTO } from "./dto/add-tab-item.dto";
import { EditTabItemDTO } from "./dto/edit-tab-item.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { TabQueryStatusDTO } from "./dto/tab-query-status.dto";

@UseGuards(AuthGuard)
@Controller('tabs')
export class TabController {
  constructor ( private readonly tabService: TabService) {}

  @Get()
  async showTabs(@Query() query: TabQueryStatusDTO) {
    return this.tabService.showTabs(query)
  }

  @Get('/:id')
  async getTab(@ParamId() id: number ){
    return this.tabService.getTab(id)
  }

  @Get('/:id/items')
  async getTabItems(@ParamId() id: number){
    return this.tabService.getTabItems(id)
  }

  @Post('/')
  async openTab(@Employee('id') employeeId: number){ 
    return this.tabService.openTab(employeeId)
  }

  @Post('/:id/items')
  async addTabItem(@ParamId()  id: number, @Body() itemData: AddTabItemDTO){
    return this.tabService.addTabItem(id, itemData)
  }

  @Patch('/:id/items')
  async editTabItem(@ParamId() id:number, @Body() itemData: EditTabItemDTO){
    return this.tabService.editTabItem(id, itemData)
  }

  @Patch('/close/:id')
  async closeTab(@ParamId() id: number, @Employee('id') employeeId:number){ 
    return this.tabService.closeTab(id, employeeId)
  }

  @Patch('/cancel/:id')
  async cancelTab(@ParamId() id: number, @Query() query: CancelTabDTO, @Employee('id') employeeId:number){
    return this.tabService.cancelTab(id, query, employeeId)
  }
}