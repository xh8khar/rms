import { Controller, Get, Put, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private service: InventoryService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.findAll(req.user.restaurantId);
  }

  @Get('low-stock')
  lowStock(@Req() req: any) {
    return this.service.findLowStock(req.user.restaurantId);
  }

  @Put(':id')
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number, @Req() req: any) {
    return this.service.updateStock(Number(id), quantity, req.user.restaurantId);
  }
}
