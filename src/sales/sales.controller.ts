import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { RegisterSaleDTO } from "./dto/register-sale.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { Employee } from "src/decorators/employee.decorator";

@UseGuards(AuthGuard)
@Controller('sales')
export class SalesController{ 

  constructor( private readonly salesService: SalesService){}

  @Get()
  async showSales(){ 
    return this.salesService.showSales()
  }

  @Get('/:id')
  async getSale(@Param() { id }){ 
    return this.salesService.getSale( id )
  }

  @Get(':id/items')
  async showSaleItems(@Param() { id }){
    return this.salesService.showSaleItems( id )
  }
  
  @Get(':id/items/:itemId')
  async getSaleItem(@Param() { id, itemId }){

  }

  @Post('')
  async registerSale(@Body() saleData: RegisterSaleDTO, @Employee('id') id: number){  
    return this.salesService.registerSale(  saleData, id)
  }

  @Patch('/:id/items/:itemId')
  async updateSaleItem(){ 

  }

  @Delete('/:id/items/:itemId')
  async deleteSaleItem(){ 

  }

}