import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: number) {
    return this.prisma.restaurant.findFirst({
      where: { users: { some: { id: userId } } },
    });
  }

  update(id: number, data: { name?: string; email?: string; phone?: string; address?: string; currency?: string; vatRate?: number; serviceCharge?: number }) {
    return this.prisma.restaurant.update({ where: { id }, data });
  }
}
