import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  findAll(restaurantId: number) {
    return this.prisma.table.findMany({
      where: { restaurantId },
      include: {
        orders: {
          where: { status: { not: 'Paid' } },
        },
      },
      orderBy: { number: 'asc' },
    });
  }

  async updateStatus(id: number, status: string, restaurantId: number) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');
    if (table.restaurantId !== restaurantId) throw new ForbiddenException();

    return this.prisma.table.update({
      where: { id },
      data: { status },
    });
  }
}
