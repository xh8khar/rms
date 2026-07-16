import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(private service: BillingService) {}

  @Post('invoice')
  createInvoice(@Body('orderId') orderId: number, @Req() req: any) {
    return this.service.generateInvoice(Number(orderId), req.user.restaurantId);
  }

  @Get('invoices/:id')
  getInvoice(@Param('id') id: string, @Req() req: any) {
    return this.service.getInvoice(Number(id), req.user.restaurantId);
  }
}
