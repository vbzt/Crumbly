import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { RegisterSaleDTO } from "./dto/register-sale.dto";


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
  async registerSale(@Body() saleData: RegisterSaleDTO){  
    
  }

  @Patch('/:id/items/:itemId')
  async updateSaleItem(){ 

  }

  @Delete('/:id/items/:itemId')
  async deleteSaleItem(){ 

  }

}