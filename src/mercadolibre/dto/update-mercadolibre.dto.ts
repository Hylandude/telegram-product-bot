import { PartialType } from '@nestjs/mapped-types';
import { CreateMercadolibreDto } from './create-mercadolibre.dto';

export class UpdateMercadolibreDto extends PartialType(CreateMercadolibreDto) {}
