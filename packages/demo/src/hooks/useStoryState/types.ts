export interface StoryStateProps {
  page?: number
  pageSize?: number
  onChangeRepository?: (event: RepositoryChangedEvent) => void
}

export interface RepositoryChangedEvent {
  repository: string
  branchName: string
}