import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class MonthLockDto {
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
