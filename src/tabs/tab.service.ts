import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { CancelTabDTO } from "./dto/cancel-tab.dto"
import { AddTabItemDTO } from "./dto/add-tab-item.dto"
import { EditTabItemDTO } from "./dto/edit-tab-item.dto"


@Injectable()
export class TabService {

  constructor ( private readonly prismaService: PrismaService) {}

  async showTabs() { 
    return this.prismaService.tab.findMany()
  }

  async getTab(id:number){ 
    const tab = await this.validateTab(id)
    return tab
  }

  async getTabItems(id: number){ 
    const tab = await this.validateTab(id)
    return this.prismaService.tabItem.findMany( { where: { tabId: tab.id } } )
  }

  async openTab(id: number){ 
    const tab = await this.prismaService.tab.create( { data: { employeeId: id} } )
    return tab
  }

  async getOpenTabs(){ 
    return this.prismaService.tab.findMany( { where: { status: 'OPEN' } } )
  }
 
  async closeTab(id: number){ 
    const timestamp = new Date()

    const closedTab = await this.prismaService.tab.update( { where: { id }, data: { status: 'CLOSED', closedAt: timestamp } } )
    const tabItems = await this.prismaService.tabItem.findMany( { where: { tabId: id }, select: { productId: true, quantity: true}} )
    return { tab: closedTab, tabItems}
  }

  async cancelTab(id: number, { deleteTabItems }: CancelTabDTO){
    const tab  = await this.validateTab(id)
    
    if (tab.status !== 'OPEN') throw new BadRequestException('Tab is not open')
    if(deleteTabItems) await this.prismaService.tabItem.deleteMany( { where: { tabId: id } } )  

    const timestamp = new Date()
    const cancelledTab = await this.prismaService.tab.update( { where: { id }, data: { status: 'CANCELLED', closedAt: timestamp } } )
    return cancelledTab
  }

  async addTabItem(tabId: number, { productId, quantity }: AddTabItemDTO ){
    const tab = await this.validateTab(tabId)
    if (tab.status !== 'OPEN') throw new BadRequestException('Cannot add items to closed/cancelled tab')
    await this.validateItem(productId) 
  
    
    const repeatedItem = await this.prismaService.tabItem.findFirst( { where: { tabId, productId } } )
    if( repeatedItem ){
      const updatedItem = await this.prismaService.tabItem.update( { where: { id: repeatedItem.id }, data: { quantity: repeatedItem.quantity.toNumber() + quantity } } )
      return { updatedItem, tab }
    }
    const newItem = await this.prismaService.tabItem.create( { data: { tabId, productId, quantity } } )
    return { newItem, tab }
  }

  async editTabItem(tabId:number, { productId, quantity }: EditTabItemDTO){ 
    const tab = await this.validateTab(tabId)
    if (tab.status !== 'OPEN') throw new BadRequestException('Cannot edit items from closed/cancelled tab')

    const tabItem = await this.prismaService.tabItem.findFirst( { where: { tabId, productId } } )
    if(!tabItem) throw new NotFoundException('Product is not registered in current tab')


    const tabItems = await this.prismaService.tabItem.findMany( { where: { tabId } } )
    if(quantity === 0){
      const removedItem = await this.removeTabItem(tabId, productId)
      return { message: 'Item removed', removedItem , tabItems }
    }

    const updatedItem = await this.prismaService.tabItem.update( { where: { id: tabItem.id }, data: { quantity } } )
    return { message: 'Item updated', updatedItem, tabItems }

  }

  async removeTabItem(tabId: number, productId: number){
    const tab = await this.validateTab(tabId)
    if (tab.status !== 'OPEN') throw new BadRequestException('Cannot remove items from closed/cancelled tab')
    const tabItem = await this.prismaService.tabItem.findFirst( { where: { tabId, productId } } )
    if(!tabItem) throw new NotFoundException('Product is not registered in current tab') 

    const updatedTabItems = await this.prismaService.tabItem.findMany( { where: { tabId } } )
    return { deletedItem: await this.prismaService.tabItem.delete( { where: { id: tabItem.id } } ), updatedTabItems }
  }   


  validateTab = async (tabId: number) => {
    const tab = await this.prismaService.tab.findUnique({ where: { id: tabId } })
    if (!tab) throw new NotFoundException('Tab does not exist')  
    return tab
  }

  validateItem = async (productId: number) => { 
    const item = await this.prismaService.stock.findUnique({ where: { id: productId } })
    if(!item) throw new NotFoundException('Product does not exist')
    return item 
  }

} 
