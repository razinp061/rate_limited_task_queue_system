import { PaginationDto } from 'src/constants/pagination.dto';

export class queryTaskDto extends PaginationDto {
  type?: string;
  status?: string;
}
