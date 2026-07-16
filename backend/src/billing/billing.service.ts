import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async generateInvoice(orderId: number, restaurantId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, restaurant: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.restaurantId !== restaurantId) throw new ForbiddenException();

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vatRate = order.restaurant.vatRate;
    const vatAmount = subtotal * (vatRate / 100);
    const serviceCharge = subtotal * (order.restaurant.serviceCharge / 100);
    const total = subtotal + vatAmount + serviceCharge;

    return this.prisma.invoice.create({
      data: {
        orderId,
        restaurantId,
        subtotal,
        vatAmount,
        vatRate,
        serviceCharge,
        total,
      },
      include: { order: { include: { items: { include: { menuItem: true } }, table: true } } },
    });
  }

  async getInvoice(id: number, restaurantId: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: { items: { include: { menuItem: true } }, table: true, createdBy: { select: { id: true, name: true } } },
        },
        payments: true,
      },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.restaurantId !== restaurantId) throw new ForbiddenException();
    return invoice;
  }
}
