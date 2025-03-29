import { ThemeMode } from '@tomplum/react-git-log'

export interface PaginationProps {
  theme: ThemeMode
  currentPage: number
  pageSize: number
  total: number
  onChangePage: (pageNumber: number) => void
  onChangePageSize: (pageSize: number) => void
}