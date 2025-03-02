import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { StockService } from "./stock.service";
import { ParamId } from "src/decorators/param.id.decorator";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";


@Controller('stock')
export class StockController{ 

  constructor(private readonly stockService: StockService) {}

  @Get('/')
  async showStock(){ 
    return this.stockService.showProducts()
  }

  @Get('/:id')
  async getProduct(@ParamId() id:number){
    return this.stockService.getProduct(id)
  }

  @Post()
  async createProduct(@Body() data: CreateProductDTO){
    return this.stockService.createProduct(data) 
  } 

  @Patch('/:id')
  async updateProduct(@Body() data: UpdateProductDTO, @ParamId() id: number){
    return this.stockService.updateProduct(id, data)
  }

  @Delete('/:id')
  async deleteProduct(@ParamId() id: number){
    return this.stockService.deleteProduct(id)
  }

}