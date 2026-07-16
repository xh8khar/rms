import { Controller, Get, Put, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TablesService } from './tables.service';

@Controller('tables')
@UseGuards(AuthGuard('jwt'))
export class TablesController {
  constructor(private service: TablesService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.findAll(req.user.restaurantId);
  }

  @Put(':id')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.service.updateStatus(Number(id), status, req.user.restaurantId);
  }
}
