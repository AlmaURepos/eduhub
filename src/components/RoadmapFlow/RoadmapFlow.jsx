import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { updateRoadmapTopicStatus } from '../../utils/updateRoadmapStatus';

// Мемоизируем nodeTypes вне компонента
const nodeTypes = {};

const RoadmapFlow = ({ roadmap, onUpdate }) => {
  const reactFlowWrapper = useRef(null);
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();

  // Создаем узлы из roadmap данных
  const initialNodes = useMemo(() => {
    const sortedTopics = Object.entries(roadmap.roadmap)
      .sort(([a], [b]) => {
        const weekA = parseInt(a.replace('week-', ''));
        const weekB = parseInt(b.replace('week-', ''));
        return weekA - weekB;
      });

    return sortedTopics.map(([weekKey, topic], index) => {
      const weekNumber = weekKey.replace('week-', '');
      const isCompleted = topic.status;
      
      return {
        id: weekKey,
        type: 'default',
        position: { x: 20 + (index * 280), y: 80 + (index % 2 * 180) },
        data: { 
          label: (
            <div className="roadmap-node">
              <div className="week-badge">Неделя {weekNumber}</div>
              <div className={`topic-title ${isCompleted ? 'completed' : ''}`}>
                {topic.topic_name}
              </div>
              {isCompleted && (
                <div className="completion-badge">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              )}
            </div>
          ),
          weekKey,
          topic,
          isCompleted
        },
        style: {
          background: isCompleted ? '#d4edda' : '#f8f9fa',
          border: isCompleted ? '2px solid #28a745' : '2px solid #dee2e6',
          borderRadius: '12px',
          padding: '0',
          minWidth: '280px',
          minHeight: '80px',
          boxShadow: isCompleted ? '0 4px 12px rgba(40, 167, 69, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }
      };
    });
  }, [roadmap.roadmap]);

  // Создаем связи между узлами
  const initialEdges = useMemo(() => {
    const edges = [];
    const sortedKeys = Object.keys(roadmap.roadmap).sort((a, b) => {
      const weekA = parseInt(a.replace('week-', ''));
      const weekB = parseInt(b.replace('week-', ''));
      return weekA - weekB;
    });

    for (let i = 0; i < sortedKeys.length - 1; i++) {
      edges.push({
        id: `e${sortedKeys[i]}-${sortedKeys[i + 1]}`,
        source: sortedKeys[i],
        target: sortedKeys[i + 1],
        type: 'smoothstep',
        style: { stroke: '#6c757d', strokeWidth: 2 },
        animated: true
      });
    }

    return edges;
  }, [roadmap.roadmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Обработчик клика по узлу
  const onNodeClick = useCallback(async (event, node) => {
    const { weekKey, isCompleted } = node.data;
    const newStatus = !isCompleted;
    
    try {
      const result = await updateRoadmapTopicStatus(roadmap.id, weekKey, newStatus);
      
      if (result.success) {
        // Обновляем узел
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === weekKey) {
              return {
                ...node,
                data: {
                  ...node.data,
                  isCompleted: newStatus,
                  topic: { ...node.data.topic, status: newStatus }
                },
                style: {
                  ...node.style,
                  background: newStatus ? '#d4edda' : '#f8f9fa',
                  border: newStatus ? '2px solid #28a745' : '2px solid #dee2e6',
                  boxShadow: newStatus ? '0 4px 12px rgba(40, 167, 69, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                }
              };
            }
            return node;
          })
        );

        // Обновляем родительский компонент
        const updatedRoadmap = {
          ...roadmap,
          roadmap: {
            ...roadmap.roadmap,
            [weekKey]: {
              ...roadmap.roadmap[weekKey],
              status: newStatus
            }
          }
        };
        
        if (onUpdate) {
          onUpdate(updatedRoadmap);
        }
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  }, [roadmap, setNodes, onUpdate]);

  // Обработчики для Controls
  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.1 });
  }, [fitView]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls 
          showInteractive={true}
          showZoom={true}
          showFitView={true}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
        />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.data?.isCompleted) return '#d4edda';
            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlow;