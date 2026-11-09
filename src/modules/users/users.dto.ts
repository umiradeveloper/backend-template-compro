import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../../common/enums';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class CreateUserDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn([...Object.values(Role)])
  role?: Role;
}
