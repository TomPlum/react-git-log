import { PaginationProps } from './types'
import styles from './Pagination.module.scss'
import classNames from 'classnames'

export const Pagination = ({ theme, pageSize, currentPage, total, onChangePage }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={styles.pagination}>
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
        {pages.map(page => (
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
    </div>
  )
}
