import { Children, isValidElement, ReactElement, ReactNode, useMemo } from 'react'
import { GitLogCore } from 'components/GitLogCore/GitLogCore'

export interface GetCoreComponentsProps {
  children: ReactNode
  componentName: string
}

const validateGraphChildren = (graph: ReactElement | undefined, child: ReactElement, componentName: string) => {
  if (graph && graph.type === GitLogCore.GraphCanvas2D && child.type === GitLogCore.GraphCanvas2D) {
    throw new Error(`<${componentName} /> can only have one <${componentName}.GraphCanvas2D /> child.`)
  }

  if (graph && graph.type === GitLogCore.GraphHTMLGrid && child.type === GitLogCore.GraphHTMLGrid) {
    throw new Error(`<${componentName} /> can only have one <${componentName}.GraphHTMLGrid /> child.`)
  }

  if (graph && graph.type !== child.type) {
    throw new Error(`<${componentName} /> can only have one <${componentName}.GraphHTMLGrid /> or <${componentName}.GraphCanvas2D /> child.`)
  }
}

export const useCoreComponents = ({ children, componentName }: GetCoreComponentsProps) => {
  return useMemo(() => {
    let tags: ReactElement | undefined = undefined
    let graph: ReactElement | undefined = undefined
    let table: ReactElement | undefined = undefined

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === GitLogCore.Tags) {
          if (tags) {
            throw new Error(`<${componentName} /> can only have one <${componentName}.Tags /> child.`)
          }

          tags = child
        } else if (child.type === GitLogCore.GraphCanvas2D || child.type === GitLogCore.GraphHTMLGrid) {
          validateGraphChildren(graph, child, componentName)

          graph = child
        } else if (child.type === GitLogCore.Table) {
          if (table) {
            throw new Error(`<${componentName} /> can only have one <${componentName}.Table /> child.`)
          }

          table = child
        }
      }
    })

    if (!graph) {
      console.warn(`react-git-log is not designed to work without a <${componentName}.GraphCanvas2D /> or a <${componentName}.GraphHTMLGrid /> component.`)
    }

    return { tags, graph, table }
  }, [children, componentName])
}