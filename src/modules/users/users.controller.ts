import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './users.dto';
import { MinRole } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@MinRole(Role.SUPERADMIN)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findAll(@Query() q: UserQueryDto) {
    return this.users.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @CurrentUser() me: AuthUser) {
    return this.users.update(id, dto, me.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() me: AuthUser) {
    return this.users.remove(id, me.id);
  }
}
