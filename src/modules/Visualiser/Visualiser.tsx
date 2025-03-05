import { VisualiserProps } from './types.ts'
import { GitGraph } from './components/GitGraph'

export const Visualiser = ({ entries }: VisualiserProps) => {
  return (
    <>
     <GitGraph commits={entries} />
    </>
  )
}