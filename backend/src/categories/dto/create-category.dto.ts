import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(['EXPENSE', 'SAVINGS', 'INVESTMENT'])
  type!: string;

  @IsNotEmpty()
  @IsUUID()
  managerId!: string;
}
