import { NodeTypes } from 'reactflow'
import { 
  ProcessNode, 
  DecisionNode, 
  StartEndNode, 
  InputOutputNode,
  DataNode,
  DocumentNode,
  ConnectorNode,
  DatabaseNode,
  ApiNode,
  TimerNode,
  UserNode,
  CloudNode,
  LoopNode
} from './SimpleNodes'

// Função para criar nodeTypes de forma simples e estável
export const createSimpleNodeTypes = (
  onLabelChange: (nodeId: string, label: string) => void,
  onColorChange: (nodeId: string, color: string) => void
): NodeTypes => {
  // Função helper para criar props com callbacks
  const createNodeProps = (nodeId: string) => ({
    onLabelChange: (label: string) => onLabelChange(nodeId, label),
    onColorChange: (color: string) => onColorChange(nodeId, color)
  })

  return {
    process: (props) => <ProcessNode {...props} {...createNodeProps(props.id)} />,
    decision: (props) => <DecisionNode {...props} {...createNodeProps(props.id)} />,
    startEnd: (props) => <StartEndNode {...props} {...createNodeProps(props.id)} />,
    inputOutput: (props) => <InputOutputNode {...props} {...createNodeProps(props.id)} />,
    data: (props) => <DataNode {...props} {...createNodeProps(props.id)} />,
    document: (props) => <DocumentNode {...props} {...createNodeProps(props.id)} />,
    connector: (props) => <ConnectorNode {...props} {...createNodeProps(props.id)} />,
    database: (props) => <DatabaseNode {...props} {...createNodeProps(props.id)} />,
    api: (props) => <ApiNode {...props} {...createNodeProps(props.id)} />,
    timer: (props) => <TimerNode {...props} {...createNodeProps(props.id)} />,
    user: (props) => <UserNode {...props} {...createNodeProps(props.id)} />,
    cloud: (props) => <CloudNode {...props} {...createNodeProps(props.id)} />,
    loop: (props) => <LoopNode {...props} {...createNodeProps(props.id)} />,
  }
}
