import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsNotEmpty()
  @IsString()
  action!: string;

  @IsNotEmpty()
  @IsString()
  entityType!: string;

  @IsNotEmpty()
  @IsString()
  entityId!: string;
}
