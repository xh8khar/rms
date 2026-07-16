import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('daily-sales')
  dailySales(@Req() req: any) {
    return this.service.dailySales(req.user.restaurantId);
  }

  @Get('popular-items')
  popularItems(@Req() req: any) {
    return this.service.popularItems(req.user.restaurantId);
  }
}
