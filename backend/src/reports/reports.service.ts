import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async dailySales(restaurantId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        restaurantId,
        createdAt: { gte: today },
      },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    return { date: today.toISOString().split('T')[0], totalRevenue, orderCount: invoices.length };
  }

  async popularItems(restaurantId: number) {
    const items = await this.prisma.orderItem.groupBy({
      by: ['menuItemId'],
      where: {
        order: { restaurantId },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: items.map((i) => i.menuItemId) } },
    });

    return items.map((item) => ({
      menuItemId: item.menuItemId,
      name: menuItems.find((m) => m.id === item.menuItemId)?.name ?? 'Unknown',
      totalSold: item._sum.quantity ?? 0,
    }));
  }
}
