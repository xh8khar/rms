import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantsController {
  constructor(private service: RestaurantsService) {}

  @Get('me')
  getMyRestaurant(@Req() req: any) {
    return this.service.findByUser(req.user.userId);
  }

  @Put('me')
  updateMyRestaurant(@Req() req: any, @Body() body: any) {
    return this.service.findByUser(req.user.userId).then((r) =>
      this.service.update(r!.id, body),
    );
  }
}
