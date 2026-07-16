import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  async getActiveOrders(restaurantId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: { in: ['Confirmed', 'Preparing'] },
      },
      include: {
        table: true,
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return orders.map((order) => {
      const grouped = order.items.reduce(
        (acc, item) => {
          const key = item.menuItem.courseType;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {} as Record<string, typeof order.items>,
      );

      const allCourseTypes = [...new Set(order.items.map((i) => i.menuItem.courseType))];

      const courseSequence = allCourseTypes
        .map((type) => ({
          courseType: type,
          items: grouped[type] ?? [],
        }));

      return { ...order, courseSequence };
    });
  }

  async updateItemStatus(orderId: number, itemId: number, status: string, restaurantId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.restaurantId !== restaurantId) throw new NotFoundException('Order not found');

    const item = await this.prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item || item.orderId !== orderId) throw new NotFoundException('Item not found');

    return this.prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });
  }

  async updateOrderStatus(orderId: number, status: string, restaurantId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.restaurantId !== restaurantId) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
