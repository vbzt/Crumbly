import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Employee } from "src/decorators/employee.decorator";
import { ParamId } from "src/decorators/param.id.decorator";
import { UpdateSaleItemDTO } from "./dto/update-sale-item.dto";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enum/role.enum";
import { RegisterSaleDTO } from "./dto/register-sale.dto";

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Cashier, Role.Manager)
@Controller('sales')
export class SalesController{ 

  constructor( private readonly salesService: SalesService){}

  @Get()
  async showSales(){ 
    return this.salesService.showSales()
  }

  @Get('/:id')
  async getSale(@ParamId()  id: number ){ 
    return this.salesService.getSale( id )
  }

  @Get(':id/items')
  async showSaleItems(@ParamId()  id:number) { 
    return this.salesService.showSaleItems( id )
  }
  
  @Get(':id/items/:itemId')
  async getSaleItem(@ParamId() id:number, @ParamId('itemId') itemId:number,){
    return this.salesService.getSaleItem(id, itemId)
  }

  @Post('')
  async registerSale(@Body() body: RegisterSaleDTO, @Employee('id') id: number){  
    return this.salesService.registerSale( body, id )
  }

  @Patch('/:id/items/:itemId')
  async updateSaleItem(@ParamId() id:number, @ParamId('itemId') itemId:number, @Body() quantity: UpdateSaleItemDTO){ 
    return this.salesService.updateSaleItem(quantity, id, itemId)
  }

  @Delete('/:id')
  async deleteSale(@ParamId() id:number){ 
    return this.salesService.deleteSale(id)
  }

  @Delete('/:id/items/:itemId')
  async deleteSaleItem(@ParamId() id:number, @ParamId('itemId') itemId:number){ 
    return this.salesService.deleteSaleItem(id, itemId)
  }

}