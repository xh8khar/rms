import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAll(restaurantId: number) {
    return this.prisma.inventoryItem.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
    });
  }

  async findLowStock(restaurantId: number) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { restaurantId },
    });
    return items.filter((item) => item.quantity < item.minStock);
  }

  async updateStock(id: number, quantity: number, restaurantId: number) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    if (item.restaurantId !== restaurantId) throw new ForbiddenException();

    return this.prisma.inventoryItem.update({
      where: { id },
      data: { quantity },
    });
  }
}
