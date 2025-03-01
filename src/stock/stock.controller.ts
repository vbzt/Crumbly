import { Body, Controller, Get, Post } from "@nestjs/common";
import { StockService } from "./stock.service";
import { ParamId } from "src/decorators/param.id.decorator";
import { CreateProductDTO } from "./dto/create-product.dto";


@Controller('stock')
export class StockController{ 

  constructor(private readonly stockService: StockService) {}

  @Get('/')
  async showStock(){ 
    return this.stockService.showProducts()
  }

  @Get('/:id')
  async showProduct(@ParamId() id:number){
    return this.stockService.showProduct(id)
  }

  @Post()
  async createProduct(@Body() data: CreateProductDTO){
    return this.stockService.createProduct(data) 
  }

}