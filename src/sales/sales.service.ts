import { BadRequestException, Injectable, NotFoundException, Param } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SalesService{ 

  constructor( private readonly prismaService: PrismaService) { } 

  async showSales(){ 
    return this.prismaService.sales.findMany()
  }

  async getSale(id: number){ 
    return this.prismaService.sales.findFirst({ where: { id } } )
  }

  async showSaleItems(id:number){ 
    return this.prismaService.sale_items.findMany( { where: { sale_id: id } } )
  }





  async registerSale(){ 
    
  } 


  async hasStock(prodId: number, qnt: number){ 
    const product = await this.prismaService.stock.findFirst( { where: { id: prodId } } )
    if(!product) throw new NotFoundException('Product does not exists')
    if(product.amount === 0) throw new BadRequestException('Product is not in stock')
    if(product.amount < qnt) throw new BadRequestException('Solicited amount exceeds current stock')
  } 
}