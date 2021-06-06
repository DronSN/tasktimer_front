import { SortOrder } from './sort-order.enum';

export interface TableState {
  currentPage: number;
  sortField: string | undefined;
  sortOrder: SortOrder;
}
