import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { RegisterSaleDTO } from "./dto/register-sale.dto"
import { UpdateSaleItemDTO } from "./dto/update-sale-item.dto"

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

  async registerSale(saleData: RegisterSaleDTO, id: number) {
    if (saleData.saleItems.length === 0) {
      throw new BadRequestException("Cannot register an empty sale")
    }

    const { items, totalSaleValue } = await this.validateItems(saleData)

    const registeredSale = await this.prismaService.$transaction(async (trx) => {
      const sale = await trx.sale.create({
        data: { employeeId: id, totalPrice: totalSaleValue, totalItems: saleData.saleItems.length },
      })

      await trx.saleItem.createMany({
        data: items.map((item) => ({
          saleId: sale.id,
          productId: item.product_id,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      })

      const productQuantities: { [productId: number]: number } = {}
      for (const item of items) {
        if (productQuantities[item.product_id]) {
          productQuantities[item.product_id] += item.quantity
        } else {
          productQuantities[item.product_id] = item.quantity
        }
      }

      for (const productId in productQuantities) {
        const quantity = productQuantities[productId]
        const product = await this.getProduct (Number(productId), quantity)
        const amount = product.amount - quantity
        await trx.stock.update({
          where: { id: Number(productId) },
          data: { amount },
        })
      }

      return { sale, items }
    })

    return {
      message: "Sale registered successfully.",
      sale: registeredSale.sale,
      saleItems: registeredSale.items,
    }
  }

  async updateSaleItem({ quantity }: UpdateSaleItemDTO, id: number, itemId: number){
    const sale = await this.getSale(id)
    const saleItem = (await this.getSaleItem(sale!.id, itemId)).saleItem
    const product = await this.getProduct(saleItem.productId, quantity)

    const updatedProductStock = product.amount - ( quantity - saleItem.quantity )
    const updatedSaleItemSubtotal = product.price.toNumber() * quantity
    const updatedSaleTotalPrice = sale!.totalPrice.toNumber() - ( updatedSaleItemSubtotal - saleItem.subtotal.toNumber())

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


  validateItems = async (saleData: RegisterSaleDTO) => {
    let totalSaleValue = 0
    const items: { product_id: number; quantity: number; subtotal: number }[] = []
  
    for (const item of saleData.saleItems) {
      const product = await this.getProduct(item.product_id, item.quantity)
      const subtotal = item.quantity * product.price.toNumber()
      totalSaleValue += subtotal
  
      items.push({
        product_id: product.id,
        quantity: item.quantity,
        subtotal,
      })
    }
  
    return { items, totalSaleValue }
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
}