import { Request } from "express";
import { paginationAndSortingDefault } from "../middlewares/validation/query-pagination-sorting.validation-middlewares";
import { SortDirection } from "mongodb";


export const setDefaultSortAandPagination = ( req: Request ) => {
  const pageNumber: number = req.query.pageNumber === undefined ? paginationAndSortingDefault.pageNumber : +req.query.pageNumber;
  const pageSize: number = req.query.pageSize === undefined ? paginationAndSortingDefault.pageSize : +req.query.pageSize;
  const sortBy: string = req.query.sortBy === undefined ? paginationAndSortingDefault.sortBy : req.query.sortBy.toString();
  
  const sortDirection: SortDirection = req.query.sortDirection && req.query.sortDirection === 'asc' 
    ? 'asc'
    : 'desc';
  
  const searchNameTerm = req.query.searchNameTerm?.toString() || null;

  return { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm };
};
