import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { UpdateSaleItemDTO } from "./dto/update-sale-item.dto"
import { RegisterSaleDTO } from "./dto/register-sale.dto"

@Injectable()
export class SalesService {
  constructor( private readonly prismaService: PrismaService)  {}

  async showSales() {
    return this.prismaService.sale.findMany()
  }

  async getSale(id: number) {
    const sale = await this.prismaService.sale.findFirst( { where: { id } } )
    if(!sale) throw new NotFoundException('Sale do not exists')
    return sale
  }

  async showSaleItems(id: number) {
    const sale = await this.prismaService.sale.findFirst( { where: { id } } )
    if(!sale) throw new NotFoundException('Sale do not exists')
    const saleItems = await this.prismaService.saleItem.findMany({ where: { saleId: sale.id } })
    return saleItems

  }

  async getSaleItem(id:number, itemId:number){
    const saleItem =  await this.prismaService.saleItem.findFirst( { where: { saleId: id, productId: itemId}})
    if(!saleItem) throw new NotFoundException('Product is not registered in current sale')

    const item = await this.prismaService.stock.findFirst( { where: { id: itemId}})
    return { saleItem, item }
  }

  async registerSale({ tabId }: RegisterSaleDTO, employeeId: number) {
    const tab = await this.getTab(tabId);
  
    const tabItems = await this.prismaService.tabItem.findMany({
      where: { tabId: tab.id },
      select: {
        productId: true,
        quantity: true,
        product: { select: { price: true, amount: true } }
      }
    });
  
    if (!tabItems.length) {
      throw new BadRequestException("Cannot register an empty sale");
    }
  
    for (const item of tabItems) {
      await this.hasStock(item.product, item.quantity.toNumber());
    }
  
    const saleItems = tabItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      subtotal: item.product.price.toNumber() * item.quantity.toNumber(),
    }));
  
    const totalSaleValue = saleItems.reduce((acc, item) => acc + item.subtotal, 0);
  
    const registeredSale = await this.prismaService.$transaction(async trx => {
      const sale = await trx.sale.create({
        data: {
          employeeId,
          totalPrice: totalSaleValue,
          totalItems: saleItems.length,
          tabId,
        },
      });
  
      await trx.saleItem.createMany({
        data: saleItems.map(item => ({
          saleId: sale.id,
          productId: item.productId,
          quantity: item.quantity.toNumber(),
          subtotal: item.subtotal,
        })),
      });
  
      for (const item of saleItems) {
        const product = await trx.stock.findUniqueOrThrow({
          where: { id: item.productId },
        });
  
        await trx.stock.update({
          where: { id: item.productId },
          data: { amount: product.amount - item.quantity.toNumber() },
        });
      }
  
      return { sale, saleItems };
    });
  
    return {
      message: "Sale registered successfully.",
      sale: registeredSale.sale,
      saleItems: registeredSale.saleItems,
    };
  }
  
  
  async updateSaleItem({ quantity }: UpdateSaleItemDTO, id: number, itemId: number){
    const sale = await this.getSale(id)
    const saleItem = (await this.getSaleItem(sale!.id, itemId)).saleItem
    const product = await this.getProduct(saleItem.productId, quantity) 

    if(quantity === 0) return this.deleteSaleItem(id, itemId)
    const updatedProductStock = product.amount - ( quantity - saleItem.quantity )
    const updatedSaleItemSubtotal = product.price.toNumber() * quantity
    const updatedSaleTotalPrice = sale.totalPrice.toNumber() - ( saleItem.subtotal.toNumber() - updatedSaleItemSubtotal ) 

    const updatedStock = await this.prismaService.stock.update( { data: { amount: updatedProductStock }, where: { id: saleItem.productId } } )
    const updatedSaleItem = await this.prismaService.saleItem.update( { data: { subtotal: updatedSaleItemSubtotal, quantity }, where: { id: saleItem.id } })
    const updatedSale = await this.prismaService.sale.update( { data: { totalPrice: updatedSaleTotalPrice }, where: { id: sale!.id} } )

    return { updatedSaleItem, updatedSale, updatedStock }
  }

  async deleteSale(id:number){ 
    const sale = await this.getSale(id) 
    const saleItems = await this.prismaService.saleItem.findMany( { where: { saleId: sale?.id}})
    for( const sale of saleItems ){ 
      const currentItemStock = await this.prismaService.stock.findFirst( { where: { id: sale.productId } } )
      const updatedItemStock = await this.prismaService.stock.update( { data: { amount: currentItemStock!.amount + sale.quantity }, where: { id: sale.productId} })
      await this.prismaService.saleItem.delete( { where: { id: sale.id } } )
    }
    const deletedSale =  await this.prismaService.sale.delete( { where: { id } } )
    return { deletedSale, saleItems }
  }

  async deleteSaleItem(id: number, itemId: number){ 
    const sale = await this.getSale(id)
    const saleItem = (await this.getSaleItem(sale!.id, itemId)).saleItem
    if(!saleItem) throw new NotFoundException('Product is not registered in current sale')
    const product = await this.getProduct(saleItem.productId, saleItem.quantity)

    const updatedSaleTotalPrice = sale.totalPrice.toNumber() - saleItem.subtotal.toNumber()
    const updatedSaleTotalItems = sale.totalItems - 1
    const updatedProductStock = product.amount + saleItem.quantity
    

    const updatedStock = await this.prismaService.stock.update( { data: { amount: updatedProductStock }, where: { id: saleItem.productId } } )
    const deletedSaleItem = await this.prismaService.saleItem.delete( { where: { id: saleItem.id} } )
    const updatedSale = await this.prismaService.sale.update( { data: { totalPrice: updatedSaleTotalPrice, totalItems: updatedSaleTotalItems}, where: { id: sale!.id} } )

    return { deletedSaleItem, updatedSale, updatedStock}
  } 
  
  getProduct = async (prodId: number, qnt: number) => {
    const product = await this.prismaService.stock.findFirst({ where: { id: prodId } })
    if (!product) {
      throw new NotFoundException("Product does not exists.")
    }
    await this.hasStock(product, qnt)
    return product
  }

  hasStock = async (product, qnt: number) => {
    if (product.amount === 0) {
      throw new BadRequestException("Product is not in stock")
    }
    if (product.amount < qnt) {
      throw new BadRequestException("Solicited amount exceeds current stock")
    }
  }

  getTab = async (tabId: number) => {
    const tab = await this.prismaService.tab.findUnique({ where: { id: tabId } });
  
    if (!tab) throw new NotFoundException('Tab does not exist')
  
    if (tab.status !== 'CLOSED') throw new BadRequestException('Tab must be closed to be registered as a sale')
  
    const saleExists = await this.prismaService.sale.findUnique( { where: { tabId } } )
    if (saleExists) throw new BadRequestException('A sale is already registered for this tab')
  
    return tab
  }
  
}