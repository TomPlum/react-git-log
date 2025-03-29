export interface StoryStateProps {
  isServerSidePaginated?: boolean
  onChangeRepository?: (event: RepositoryChangedEvent) => void
}

export interface RepositoryChangedEvent {
  repository: string
  branchName: string
}