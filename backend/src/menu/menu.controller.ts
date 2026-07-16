import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MenuService } from './menu.service';

@Controller('menu')
@UseGuards(AuthGuard('jwt'))
export class MenuController {
  constructor(private service: MenuService) {}

  @Get()
  getMenu(@Req() req: any) {
    return this.service.getCategories(req.user.restaurantId);
  }

  @Get('allergens')
  getAllergens() {
    return this.service.getAllergens();
  }
}
