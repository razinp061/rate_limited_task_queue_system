import { PaginationDto } from 'src/contants/pagination.dto';

export class queryTaskDto extends PaginationDto {
  type?: string;
  status?: string;
}
