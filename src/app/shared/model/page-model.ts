export interface PageModel<T> {
  content: T[];
  totalElements: number;
  page: number;
}
