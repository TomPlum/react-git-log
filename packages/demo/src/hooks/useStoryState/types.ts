export interface StoryStateProps {
  fromBranch?: string
  onChangeRepository?: (event: RepositoryChangedEvent) => void
}

export interface RepositoryChangedEvent {
  repository: string
  branchName: string
}