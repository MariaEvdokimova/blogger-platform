import { query } from 'express-validator';
import { PaginationAndSorting, SortDirection } from '../../types/pagination-and-sorting';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};
 
export function paginationAndSortingValidation<T extends string>(sortFieldsEnum: Record<string, T>) {//Record<string, T> - тип объекта, где ключи типа string, значения типа Т
  return [
    query('pageNumber')
      .optional()
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),
 
    query('pageSize')
      .optional()
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),
 
    query('sortBy')
      .optional()
      .default(Object.values(sortFieldsEnum)[0]) // Дефолтное значение - первое поле
      .isIn(Object.values(sortFieldsEnum))
      .withMessage(`Allowed sort fields: ${Object.values(sortFieldsEnum).join(', ')}`),
 
    query('sortDirection')
      .optional()
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(`Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`),
  ];
 }
