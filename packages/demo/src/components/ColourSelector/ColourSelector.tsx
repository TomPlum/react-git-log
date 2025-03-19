import { ThemeSelectorProps } from './types'
import { useCallback } from 'react'
import { cyberpunkNeon, natureEssence, neonAurora, rainbow, retroPop, solarFlare } from 'themes'
import { CustomSelect } from 'components/CustomSelect'
import { ColourItem } from 'components/ColourItem'

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

export const ColourSelector = ({ selected, onChange }: ThemeSelectorProps) => {
  const handleChange = useCallback((id: string) => {
    onChange({
      id,
      colors: getTheme(selected)
    })
  }, [onChange, selected])

  return (
    <CustomSelect
      value={selected}
      onChange={handleChange}
      options={[
        {
          value: 'rainbow',
          label: (
            <ColourItem
              id='rainbow'
              name='Rainbow'
              colours={rainbow}
              selected={selected}
            />
          )
        },
        {
          value: 'neon-aurora',
          label: (
            <ColourItem
              id='neon-aurora'
              name='Neon Aurora'
              colours={neonAurora}
              selected={selected}
            />
          )
        },
        {
          value: 'solar-flare',
          label: (
            <ColourItem
              id='solar-flare'
              name='Solar Flare'
              colours={solarFlare}
              selected={selected}
            />
          )
        },
        {
          value: 'cyberpunk-neon',
          label: (
            <ColourItem
              id='cyberpunk-neon'
              name='Cyberpunk Neon'
              colours={cyberpunkNeon}
              selected={selected}
            />
          )
        },
        {
          value: 'nature-essence',
          label: (
            <ColourItem
              id='nature-essence'
              name='Nature Essence'
              colours={natureEssence}
              selected={selected}
            />
          )
        },
        {
          value: 'retro-pop',
          label: (
            <ColourItem
              id='retro-pop'
              name='Retro Pop'
              colours={retroPop}
              selected={selected}
            />
          )
        }
      ]}
    />
  )
}