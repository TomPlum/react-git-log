import { ThemeSelectorProps } from './types'
import { ChangeEvent, useCallback } from 'react'
import { cyberpunkNeon, natureEssence, neonAurora, rainbow, retroPop, solarFlare } from 'themes'

const getTheme = (name: string) => {
  switch (name) {
    case 'rainbow': {
      return rainbow
    }
    case 'neon-aurora': {
      return neonAurora
    }
    case 'solar-flare': {
      return solarFlare
    }
    case 'cyberpunk-neon': {
      return cyberpunkNeon
    }
    case 'nature-essence': {
      return natureEssence
    }
    case 'retro-pop': {
      return retroPop
    }
    default: {
      return []
    }
  }
}

export const ColourSelector = ({ onChange }: ThemeSelectorProps) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onChange(getTheme(e.target.value))
  }, [onChange])

  return (
    <select onChange={handleChange}>
      <option value='rainbow'>
        rainbow
      </option>
      <option value='neon-aurora'>
        neon-aurora
      </option>
      <option value='solar-flare'>
        solar-flare
      </option>
      <option value='cyberpunk-neon'>
        cyberpunk-neon
      </option>
      <option value='nature-essence'>
        nature-essence
      </option>
      <option value='retro-pop'>
        retro-pop
      </option>
    </select>
  )
}