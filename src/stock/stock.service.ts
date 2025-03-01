import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDTO } from "./dto/create-product.dto";

@Injectable()
export class StockService{ 

  constructor( private readonly prismaService: PrismaService ){}
  
  async showProducts(){
    return this.prismaService.stock.findMany()
  }

  async showProduct(id: number){ 
    return this.prismaService.stock.findUnique( { where: { id } } )
  }

  async createProduct(data: CreateProductDTO){
    return this.prismaService.stock.create( { data: data })
  }
}