import { useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { CustomSelectProps } from './types'
import Chevron from 'assets/chevron.svg?react'
import styles from './CustomSelect.module.scss'

export const CustomSelect = ({ value, onChange, options }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      padding={0}
      isOpen={isOpen}
      positions={['bottom', 'top']}
      containerStyle={{ zIndex: '25' }}
      onClickOutside={() => setIsOpen(false)}
      content={
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={styles.item}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      }
    >
      <button className={styles.anchor} onClick={() => setIsOpen(!isOpen)}>
        {value}
        <Chevron className={isOpen ? styles.chevronOpen : styles.chevron} />
      </button>
    </Popover>
  )
}