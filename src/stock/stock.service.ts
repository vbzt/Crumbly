import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";

@Injectable()
export class StockService{ 

  constructor( private readonly prismaService: PrismaService ){}
  
  async showProducts(){
    return this.prismaService.stock.findMany()
  }

  async getProduct(id: number){ 
    await this.productExists(id)
    return this.prismaService.stock.findUnique( { where: { id } } )
  }

  // TODO: Create barcode 
  async createProduct(data: CreateProductDTO){
    return this.prismaService.stock.create( { data: data } )
  }

  async updateProduct( id:number, data: UpdateProductDTO){
    await this.productExists(id)
    return this.prismaService.stock.update( {data, where: { id } } )
  }

  async deleteProduct( id: number ){ 
    await this.productExists(id)
    return this.prismaService.stock.delete( { where: { id } } )
  }

  async productExists(id:number){ 
    if(!(await this.prismaService.stock.findUnique( { where: { id } } ))){ 
      throw new NotFoundException('Product do not exists')
    }
  }
}