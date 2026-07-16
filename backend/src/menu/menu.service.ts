import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  getCategories(restaurantId: number) {
    return this.prisma.menuCategory.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: {
        menuItems: {
          include: { allergens: { include: { allergen: true } }, modifiers: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  getAllergens() {
    return this.prisma.allergen.findMany();
  }
}
