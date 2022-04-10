import { Length, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadFileDto {
  @IsOptional()
  @Length(0, 255)
  metadata?: string;
}
