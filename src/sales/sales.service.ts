import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { RegisterSaleDTO } from "./dto/register-sale.dto"
import { StockService } from "src/stock/stock.service"
import { UpdateSaleItemDTO } from "./dto/update-sale-item.dto"

@Injectable()
export class SalesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stockService: StockService
  ) {}

  async showSales() {
    return this.prismaService.sales.findMany()
  }

  async getSale(id: number) {
    const sale = this.prismaService.sales.findFirst( { where: { id } } )
    if(!sale) throw new NotFoundException('Sale do not exists')
    return sale
  }

  async showSaleItems(id: number) {
    const sale = await this.prismaService.sales.findFirst( { where: { id } } )
    if(!sale) throw new NotFoundException('Sale do not exists')
    const saleItems = await this.prismaService.sale_items.findMany({ where: { sale_id: sale.id } })
    return saleItems

  }

  async getSaleItem(id:number, itemId:number){
    const saleItem =  await this.prismaService.sale_items.findFirst( { where: { sale_id: id, product_id: Number(itemId)}})
    if(!saleItem) throw new NotFoundException('Product is not registered in current sale')

    const item = await this.prismaService.stock.findFirst( { where: { id: Number(itemId)}})
    return { saleItem, item }
  }

  async registerSale(saleData: RegisterSaleDTO, id: number) {
    if (saleData.saleItems.length === 0) {
      throw new BadRequestException("Cannot register an empty sale")
    }

    const { items, totalSaleValue } = await this.validateItems(saleData)

    const registeredSale = await this.prismaService.$transaction(async (trx) => {
      const sale = await trx.sales.create({
        data: { employee_id: id, total_price: totalSaleValue, total_items: saleData.saleItems.length },
      })

      await trx.sale_items.createMany({
        data: items.map((item) => ({
          sale_id: sale.id,
          product_id: item.product_id,
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
        const product = await this.getProduct(parseInt(productId), quantity)
        const amount = product.amount - quantity
        await trx.stock.update({
          where: { id: parseInt(productId) },
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
    const sale = await this.getSale(Number(id))
    const saleItem = (await this.getSaleItem(sale!.id, Number(itemId))).saleItem
    const product = await this.getProduct(Number(itemId), quantity)

    const updatedProductStock = product.amount - ( quantity - saleItem.quantity )
    const updatedSaleItemSubtotal = product.price.toNumber() * quantity
    const updatedSaleTotalPrice = sale!.total_price.toNumber() - ( updatedSaleItemSubtotal - saleItem.subtotal.toNumber())

    const updatedStock = await this.prismaService.stock.update( { data: { amount: updatedProductStock }, where: { id: saleItem.product_id } } )
    const updatedSaleItem = await this.prismaService.sale_items.update( { data: { subtotal: updatedSaleItemSubtotal, quantity }, where: { id: saleItem.id } })
    const updatedSale = await this.prismaService.sales.update( { data: { total_price: updatedSaleTotalPrice }, where: { id: sale!.id} } )

    return { updatedSaleItem, updatedSale, updatedStock }
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