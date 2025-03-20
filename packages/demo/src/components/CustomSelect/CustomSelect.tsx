import { CSSProperties, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { CustomSelectProps } from './types'
import Chevron from 'assets/chevron.svg?react'
import styles from './CustomSelect.module.scss'
import classNames from 'classnames'

export const CustomSelect = ({ value, onChange, className, options, theme, width }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const textColour = theme === 'dark' ? 'rgb(239,239,239)' : 'black'
  const backgroundColour = theme === 'dark' ? 'rgb(68,68,68)' : 'rgb(218,218,218)'
  const hoverBackgroundColour = theme === 'dark' ? 'rgb(138,138,138)' : 'rgb(255,255,255)'
  const selectedBackgroundColour = theme === 'dark' ? 'rgb(108,108,108)' : 'rgb(255,255,255)'

  return (
    <Popover
      padding={0}
      isOpen={isOpen}
      positions={['bottom', 'top']}
      containerStyle={{ zIndex: '25' }}
      onClickOutside={() => setIsOpen(false)}
      content={
        <div
          className={styles.dropdown}
          style={{
            width,
            backgroundColor: backgroundColour
          }}
        >
          {options.map(({ label, value: optionValue }) => (
            <div
              key={optionValue}
              className={classNames(
                styles.item,
                { [styles.selected] : value === optionValue }
              )}
              style={{
                backgroundColor: value === optionValue ? selectedBackgroundColour : backgroundColour,
                color: textColour,
                '--hover-colour': hoverBackgroundColour
              } as CSSProperties}
              onClick={() => {
                onChange(optionValue)
                setIsOpen(false)
              }}
            >
              {label}
            </div>
          ))}
        </div>
      }
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          styles.anchor,
          { [styles.anchorOpen]: isOpen },
          className
        )}
        style={{
          width,
          backgroundColor: backgroundColour
        }}
      >
        <span style={{ color: textColour }}>
          {value}
        </span>

        <Chevron
          style={{ fill: textColour }}
          className={isOpen ? styles.chevronOpen : styles.chevron}
        />
      </button>
    </Popover>
  )
}