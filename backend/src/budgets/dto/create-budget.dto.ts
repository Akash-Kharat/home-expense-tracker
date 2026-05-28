import { IsNotEmpty, IsNumber, IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(2000)
  year!: number;
}
