import { IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Tags } from 'exiftool-vendored';

export class ImageMetadataDto {
  @IsPositive()
  @Type(() => Number)
  width: number;

  @IsPositive()
  @Type(() => Number)
  height: number;

  @Type(() => Object)
  metadata: Tags;
}

export type Dimension = Pick<ImageMetadataDto, 'width' | 'height'>;
