import { ColourItemProps } from './types'
import styles from './ColourItem.module.scss'
import classNames from 'classnames'

export const ColourItem = ({ id, name, selected, colours }: ColourItemProps) => {
  return (
    <div className={classNames(styles.item, { [styles.selected]: id === selected })}>
      <p className={styles.name}>
        {name}
      </p>

      <div className={styles.colours}>
        {colours.map((colour, index) => (
          <div
            key={`colour-${index}`}
            className={styles.colour}
            style={{ backgroundColor: colour }}
          />
        ))}
      </div>
    </div>
  )
}