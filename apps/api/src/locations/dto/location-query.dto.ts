import { IsOptional, IsString, MaxLength } from 'class-validator';

export class LocationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}