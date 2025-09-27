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
} from './CustomNodes'

// Função para criar nodeTypes com callbacks estáveis
export const createNodeTypes = (
  onLabelChange: (nodeId: string, label: string) => void,
  onColorChange: (nodeId: string, color: string) => void
): NodeTypes => ({
  process: (props) => <ProcessNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  decision: (props) => <DecisionNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  startEnd: (props) => <StartEndNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  inputOutput: (props) => <InputOutputNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  data: (props) => <DataNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  document: (props) => <DocumentNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  connector: (props) => <ConnectorNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  database: (props) => <DatabaseNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  api: (props) => <ApiNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  timer: (props) => <TimerNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  user: (props) => <UserNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  cloud: (props) => <CloudNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
  loop: (props) => <LoopNode {...props} onLabelChange={(label) => onLabelChange(props.id, label)} onColorChange={(color) => onColorChange(props.id, color)} />,
})
