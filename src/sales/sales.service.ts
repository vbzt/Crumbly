import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterSaleDTO } from "./dto/register-sale.dto";
import { StockService } from "src/stock/stock.service";
import { UpdateProductDTO } from "src/stock/dto/update-product.dto";

@Injectable()
export class SalesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stockService: StockService
  ) {}

  async showSales() {
    return this.prismaService.sales.findMany();
  }

  async getSale(id: number) {
    if(!id || isNaN(Number(id))) throw new BadRequestException('Id must be a number')
    return this.prismaService.sales.findFirst( { where: { id } } )
  }

  async showSaleItems(id: number) {
    const sale = await this.prismaService.sale_items.findMany({ where: { sale_id: id } });
    if(sale.length === 0) throw new NotFoundException("Sale do not exists")
    return sale

  }

  async getSaleItem(id:number, itemId:number){
    const itemSale =  await this.prismaService.sale_items.findFirst( { where: { sale_id: id, product_id: Number(itemId)}})
    const item = await this.prismaService.stock.findFirst( { where: { id: Number(itemId)}})
    
    return { itemSale, item }
  }

  async registerSale(saleData: RegisterSaleDTO, id: number) {
    if (saleData.saleItems.length === 0) {
      throw new BadRequestException("Cannot register an empty sale");
    }

    const { items, totalSaleValue } = await this.validateItems(saleData);

    const registeredSale = await this.prismaService.$transaction(async (trx) => {
      const sale = await trx.sales.create({
        data: { employee_id: id, total_price: totalSaleValue, total_items: saleData.saleItems.length },
      });

      await trx.sale_items.createMany({
        data: items.map((item) => ({
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      });

      const productQuantities: { [productId: number]: number } = {};

      for (const item of items) {
        if (productQuantities[item.product_id]) {
          productQuantities[item.product_id] += item.quantity;
        } else {
          productQuantities[item.product_id] = item.quantity;
        }
      }

      for (const productId in productQuantities) {
        const quantity = productQuantities[productId];
        const product = await this.getProduct(parseInt(productId), quantity);
        const amount = product.amount - quantity;
        await trx.stock.update({
          where: { id: parseInt(productId) },
          data: { amount },
        });
      }

      return { sale, items };
    });

    return {
      message: "Sale registered successfully.",
      sale: registeredSale.sale,
      saleItems: registeredSale.items,
    };
  }

  validateItems = async (saleData: RegisterSaleDTO) => {
    let totalSaleValue = 0;
    const items = await Promise.all(
      saleData.saleItems.map(async (item) => {
        const product = await this.getProduct(item.product_id, item.quantity);
        const subtotal = item.quantity * product.price.toNumber();
        totalSaleValue += subtotal;
        return {
          product_id: product.id,
          quantity: item.quantity,
          subtotal,
        };
      })
    );

    return { items, totalSaleValue };
  };

  getProduct = async (prodId: number, qnt: number) => {
    const product = await this.prismaService.stock.findFirst({ where: { id: prodId } });
    if (!product) {
      throw new NotFoundException("Product does not exists.");
    }
    await this.hasStock(product, qnt);
    return product;
  };

  hasStock = async (product, qnt: number) => {
    if (product.amount === 0) {
      throw new BadRequestException("Product is not in stock");
    }
    if (product.amount < qnt) {
      throw new BadRequestException("Solicited amount exceeds current stock");
    }
  };
}