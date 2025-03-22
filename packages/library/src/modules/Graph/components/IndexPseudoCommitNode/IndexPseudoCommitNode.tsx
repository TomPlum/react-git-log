import classNames from 'classnames'
import styles from './IndexPseudoCommitNode.module.scss'
import { useTheme } from 'hooks/useTheme'
import { IndexPseudoCommitNodeProps } from 'modules/Graph/components/IndexPseudoCommitNode/types'

export const IndexPseudoCommitNode = ({ animate, columnColour }: IndexPseudoCommitNodeProps) => {
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
        border: `2px dotted ${shiftAlphaChannel(columnColour, 0.5)}`,
        backgroundColor: shiftAlphaChannel(columnColour, 0.05),
      }}
    />
  )
}