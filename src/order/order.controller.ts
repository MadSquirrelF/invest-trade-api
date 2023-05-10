import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
  Delete,
  Put
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { UserModel } from 'src/user/user.model';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('user-orders')
  @Auth()
  async getUserOrders(@User() user: UserModel) {
    return this.orderService.getAllUserOrders(user);
  }

  @Get()
  @Auth('admin')
  async getAllOrders(@Query('searchTerm') searchTerm?: string) {
    return this.orderService.getAll(searchTerm)
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  @Auth('admin')
  async getOrder(@Param('id', IdValidationPipe) id: string) {
    return this.orderService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Put('update/:id')
  @HttpCode(200)
  @Auth()
  async updateOrderUser(@Param('id', IdValidationPipe) orderId: string, @Body() dto: UpdateOrderDto, @User() user: UserModel) {
    return this.orderService.updateOrder(orderId, dto, user)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.orderService.deleteOrder(id)
  }

  @Put('cancel/:id')
  @HttpCode(200)
  @Auth()
  async cancelOrder(@User() user: UserModel, @Param('id', IdValidationPipe) id: string ) {
    return this.orderService.cancelOrder(id,user)
  }

  @Post('create-order')
  @HttpCode(200)
  @Auth()
  async createOrder(
    @User() user: UserModel,
    @Body()
    dto: CreateOrderDto
  ) {
    return this.orderService.createOrder(user, dto)
  }
 
}