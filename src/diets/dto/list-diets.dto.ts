import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListDietsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  orgId?: string;
}
