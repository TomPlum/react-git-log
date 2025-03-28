export interface StoryStateProps {
  page?: number
  onChangeRepository?: (event: RepositoryChangedEvent) => void
}

export interface RepositoryChangedEvent {
  repository: string
  branchName: string
}