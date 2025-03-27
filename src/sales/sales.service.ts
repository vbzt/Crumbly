import { BadRequestException, Injectable, NotFoundException, Param } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterSaleDTO } from "./dto/register-sale.dto";

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





  async registerSale(saleData: RegisterSaleDTO, id: number){ 
    if(saleData.saleItems.length === 0) throw new BadRequestException("Cannot register an empty sale")
    for(const saleItem of saleData.saleItems){ 
      const itemData = await this.getProduct(saleItem.product_id, saleItem.quantity)
      console.log(itemData)
    
    }
      
  } 

  async getProduct(prodId: number, qnt: number){ 
    const product = await this.prismaService.stock.findFirst( { where: { id: prodId } } )
    if(!product) throw new NotFoundException('Product does not exists.')
    if(product.amount === 0) throw new BadRequestException('Product is not in stock')
    if(product.amount < qnt) throw new BadRequestException('Solicited amount exceeds current stock')
    return product
  } 
}