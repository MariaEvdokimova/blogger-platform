import { ObjectId } from "mongodb"

export type PaginationQueryParamsDto = { 
  pageNumber: number, 
  pageSize: number, 
  sortBy: string, 
  sortDirection: 'asc' | 'desc', 
  searchNameTerm?: string | ObjectId | null 
}
