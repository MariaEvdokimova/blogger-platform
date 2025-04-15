export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};
