import classNames from 'classnames'
import styles from './IndexPseudoCommitNode.module.scss'
import { useTheme } from 'hooks/useTheme'
import { IndexPseudoCommitNodeProps } from 'modules/Graph/strategies/Grid/components/IndexPseudoCommitNode/types'
import { useGraphContext } from 'modules/Graph/context'

export const IndexPseudoCommitNode = ({ animate, columnColour }: IndexPseudoCommitNodeProps) => {
  const { nodeSize } = useGraphContext()
  const { shiftAlphaChannel } = useTheme()

  return (
    <div
      id='index-pseudo-commit-node'
      data-testid='index-pseudo-commit-node'
      className={classNames(
        styles.indexNode,
        { [styles.spin]: animate },
      )}
      style={{
        width: nodeSize,
        height: nodeSize,
        border: `2px dotted ${shiftAlphaChannel(columnColour, 0.5)}`,
        backgroundColor: shiftAlphaChannel(columnColour, 0.05),
      }}
    />
  )
}