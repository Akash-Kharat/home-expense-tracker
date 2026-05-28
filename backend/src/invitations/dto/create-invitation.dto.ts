import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'MEMBER'])
  role?: string;
}
