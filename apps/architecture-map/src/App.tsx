import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

function App() {
  const [graph, setGraph] = useState<GraphData | null>(null);

  useEffect(() => {
    fetch('/graph-data.json')
      .then((res) => res.json())
      .then((data) => setGraph({ nodes: data.nodes, edges: data.edges }))
      .catch(() => {
        setGraph({
          nodes: [
            { id: 'onboarding', data: { label: 'onboarding' }, position: { x: 0, y: 0 } },
            {
              id: 'delta-ignition',
              data: { label: 'delta-ignition' },
              position: { x: 200, y: 100 },
            },
            { id: 'k4-ui', data: { label: 'k4-ui' }, position: { x: 100, y: 200 } },
            { id: 'k4-element', data: { label: 'k4-element' }, position: { x: 300, y: 200 } },
          ],
          edges: [
            { id: 'e1', source: 'onboarding', target: 'k4-ui', animated: true },
            { id: 'e2', source: 'delta-ignition', target: 'k4-ui', animated: true },
            { id: 'e3', source: 'delta-ignition', target: 'k4-element', animated: true },
          ],
        });
      });
  }, []);

  if (!graph) return <div style={{ padding: 20 }}>Loading constellation…</div>;

  const onNodesChange = useCallback(
    (changes: any) => setGraph((g) => ({ ...g!, nodes: applyNodeChanges(changes, g!.nodes) })),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setGraph((g) => ({ ...g!, edges: applyEdgeChanges(changes, g!.edges) })),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#1e2530" gap={16} />
        <Controls />
        <MiniMap nodeColor={() => '#6e7681'} />
      </ReactFlow>
    </div>
  );
}

export default App;
