import { PaginationProps } from './types'
import styles from './Pagination.module.scss'
import classNames from 'classnames'
import { useMemo } from 'react'

export const Pagination = ({ theme, pageSize, currentPage, total, onChangePage }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  const visiblePageButtons = useMemo(() => {
    const pagesToShow = 11
    const half = Math.floor(pagesToShow / 2)

    let start = Math.max(1, currentPage - half)
    let end = start + pagesToShow - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - pagesToShow + 1)
    }

    return pages.slice(start - 1, end)
  }, [currentPage, pages, totalPages])

  return (
    <div className={styles.pagination}>
      <button
        disabled={currentPage === 1}
        className={classNames(
          styles.chevronButton,
          { [styles.disabled]: currentPage === 1 }
        )}
        onClick={() => onChangePage(1)}
        style={{
          color: theme === 'dark' ? 'white': 'black'
        }}
      >
        {'<<'}
      </button>

      <button
        disabled={currentPage === 1}
        className={classNames(
          styles.chevronButton,
          { [styles.disabled]: currentPage === 1 }
        )}
        onClick={() => onChangePage(currentPage - 1)}
        style={{
          color: theme === 'dark' ? 'white': 'black'
        }}
      >
        {'<'}
      </button>

      <div className={styles.pages}>
        {visiblePageButtons.map(page => (
          <button
            key={page}
            onClick={() => onChangePage(page)}
            className={classNames(
              styles.pageButton,
              { [styles.active]: page === currentPage }
            )}
            style={{
              color: theme === 'dark' ? 'white': 'black'
            }}
            title={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={classNames(
          styles.chevronButton,
          { [styles.disabled]: currentPage === totalPages }
        )}
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
        style={{
          color: theme === 'dark' ? 'white': 'black'
        }}
      >
        {'>'}
      </button>

      <button
        className={classNames(
          styles.chevronButton,
          { [styles.disabled]: currentPage === totalPages }
        )}
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(totalPages)}
        style={{
          color: theme === 'dark' ? 'white': 'black'
        }}
      >
        {'>>'}
      </button>
    </div>
  )
}
