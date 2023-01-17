import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { UserModel } from 'src/user/user.model';
import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly NewService: NewsService) { }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.NewService.bySlug(slug)
  }


  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.NewService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.NewService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.NewService.create()
  }

  @Put('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.NewService.updateCountOpened(slug)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(@Param('id', IdValidationPipe) id: string, @Body() dto: NewsDto) {
    return this.NewService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {

    return this.NewService.delete(id)
  }

}
