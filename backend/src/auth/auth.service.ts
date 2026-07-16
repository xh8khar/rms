import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string; name: string; role: string; restaurantId: number }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
        restaurantId: data.restaurantId,
      },
      select: { id: true, email: true, name: true, role: true, restaurantId: true },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role, restaurantId: user.restaurantId };
    return { accessToken: this.jwtService.sign(payload), user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, restaurantId: true } });
  }
}
