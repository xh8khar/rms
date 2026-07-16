import { Controller, Get, Post, Put, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.findAll(req.user.restaurantId);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.restaurantId, req.user.userId);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.service.updateStatus(Number(id), status, req.user.restaurantId);
  }

  @Put(':id/items')
  updateItems(@Param('id') id: string, @Body() body: { items: { menuItemId: number; quantity: number; courseType: string; modifiers?: string; price?: number }[] }, @Req() req: any) {
    return this.service.updateItems(Number(id), body.items, req.user.restaurantId);
  }
}
