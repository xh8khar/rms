import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll(restaurantId: number) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        table: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(body: { tableId: number; coverCount?: number; notes?: string; items: { menuItemId: number; quantity: number; courseType: string; modifiers?: string }[] }, restaurantId: number, userId: number) {
    const table = await this.prisma.table.findUnique({ where: { id: body.tableId } });
    if (!table || table.restaurantId !== restaurantId) throw new BadRequestException('Invalid table');

    const itemData = await Promise.all(
      body.items.map(async (it) => {
        const menuItem = await this.prisma.menuItem.findUnique({ where: { id: it.menuItemId } });
        if (!menuItem || menuItem.restaurantId !== restaurantId) throw new BadRequestException(`Invalid menuItem ${it.menuItemId}`);
        return {
          menuItemId: it.menuItemId,
          quantity: it.quantity,
          courseType: it.courseType,
          price: menuItem.price,
          modifiers: it.modifiers ?? null,
          status: 'Pending',
        };
      }),
    );

    return this.prisma.order.create({
      data: {
        restaurantId,
        tableId: body.tableId,
        createdById: userId,
        coverCount: body.coverCount ?? 1,
        notes: body.notes,
        status: 'Pending',
        items: { create: itemData },
      },
      include: {
        table: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
    });
  }

  async updateStatus(id: number, status: string, restaurantId: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.restaurantId !== restaurantId) throw new ForbiddenException();

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        table: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
    });
  }

  async updateItems(id: number, items: { menuItemId: number; quantity: number; courseType: string; modifiers?: string; price?: number }[], restaurantId: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.restaurantId !== restaurantId) throw new ForbiddenException();

    const itemData = await Promise.all(
      items.map(async (it) => {
        const menuItem = await this.prisma.menuItem.findUnique({ where: { id: it.menuItemId } });
        if (!menuItem || menuItem.restaurantId !== restaurantId) throw new BadRequestException(`Invalid menuItem ${it.menuItemId}`);
        return {
          menuItemId: it.menuItemId,
          quantity: it.quantity,
          courseType: it.courseType,
          price: it.price ?? menuItem.price,
          modifiers: it.modifiers ?? null,
          status: 'Pending',
        };
      }),
    );

    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });

    return this.prisma.order.update({
      where: { id },
      data: { items: { create: itemData } },
      include: {
        table: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } },
      },
    });
  }
}
