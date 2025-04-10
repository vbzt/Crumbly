import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { StockService } from "./stock.service";
import { ParamId } from "src/decorators/param.id.decorator";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { Role } from "src/enum/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Stocker, Role.Manager)
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