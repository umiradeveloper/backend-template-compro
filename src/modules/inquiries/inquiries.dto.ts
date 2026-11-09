import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { InquiryStatus } from '../../common/enums';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class CreateInquiryDto {
  @IsString() @MinLength(2) @MaxLength(120) name: string;
  @IsEmail() @MaxLength(160) email: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(160) company?: string;
  @IsOptional() @IsString() @MaxLength(200) subject?: string;
  @IsString() @MinLength(5) @MaxLength(5000) message: string;
  @IsOptional() @IsString() @MaxLength(30) source?: string;
  /** honeypot anti-spam: harus kosong */
  @IsOptional() @IsString() website?: string;
}

export class UpdateInquiryDto {
  @IsOptional() @IsEnum(InquiryStatus) status?: InquiryStatus;
  @IsOptional() @IsString() @MaxLength(5000) notes?: string;
}

export class InquiryQueryDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(InquiryStatus) status?: InquiryStatus;
}
