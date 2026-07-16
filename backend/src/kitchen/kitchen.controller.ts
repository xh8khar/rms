import { Controller, Get, Put, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KitchenService } from './kitchen.service';

@Controller('kitchen')
@UseGuards(AuthGuard('jwt'))
export class KitchenController {
  constructor(private service: KitchenService) {}

  @Get('orders')
  listOrders(@Req() req: any) {
    return this.service.getActiveOrders(req.user.restaurantId);
  }

  @Put('orders/:id/items/:itemId/status')
  updateItemStatus(@Param('id') id: string, @Param('itemId') itemId: string, @Body('status') status: string, @Req() req: any) {
    return this.service.updateItemStatus(Number(id), Number(itemId), status, req.user.restaurantId);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.service.updateOrderStatus(Number(id), status, req.user.restaurantId);
  }
}
