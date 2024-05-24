'use client';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import NodePanelSidebar from './NodePanelSidebar';
import TextMessageNode from './nodes/TextMessageNode';
import CustomEdge from './edges/CustomEdge';
import Header from './Header';

// custom node/edge type components
const nodeTypes = {
  text: TextMessageNode,
};
const edgeTypes = {
  'custom-edge': CustomEdge,
};

let id = 1;
const getId = () => `${id++}`; // unique id evertime, not a good way to generate unique ids

export default function FlowBuilder() {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  /**
   * Selected node state
   * to replace sidebar into editor window
   */
  const [selectedNode, setSelectedNode] = useState(null);

  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  /**
   * whenever a node is connected to another node,
   * this function will be called to add the edge
   */
  const onConnect = useCallback(
    params =>
      setEdges(eds => {
        // one source can have one target
        // one target can have multiple sources

        // if the source node is already connected to another node
        // then do nothing
        if (eds && eds.some(e => e.source === params.source)) {
          // give a warning
          alert('Source node is already connected to another node');

          return eds;
        } else if (eds && eds.some(e => e.target === params.target)) {
          // if the target node is already connected to another node
          // then do nothing
          return addEdge({...params}, eds);
        } else {
          // if the source and target nodes are not connected to any other nodes
          // then add the custom edge
          // basically the custom edge, renders an arrow icon at the target node
          return addEdge({...params, type: 'custom-edge'}, eds);
        }

        // addEdge(params, eds)
      }),
    [],
  );

  /**
   * dragover event handler to prevent default behavior
   * and set the drop effect to move
   */
  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * drop event handler to add a new node to the flow
   * whenever a node is dropped on the flow
   * it will create a new node with the type of the dropped element
   * and add it to the nodes array
   * and set the position of the new node to the mouse position
   */
  const onDrop = useCallback(
    event => {
      event.preventDefault();

      // validating if the dropped element is correct
      // we are getting type of the node from the dataTransfer
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // mouse position
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // creating a new node
      // and adding it to the nodes array
      const nid = getId();
      const newNode = {
        id: nid,
        type,
        position,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {value: `${type} ${nid}`, onClick: () => onNodeClick(null, {id: nid})},
      };
      setNodes(nds => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  /**
   * on click handler for the nodes
   * to select the node and show the editor
   */
  const onNodeClick = (_, node) => setSelectedNode(node);

  /**
   * the core function to update the selected node value
   * whenever a node is selected and edited
   */
  const updateSelectedNode = value => {
    if (!selectedNode) {
      return;
    }

    setNodes(nodes =>
      nodes.map(node => {
        if (node.id === selectedNode.id) {
          node.data.value = value;
        }

        return node;
      }),
    );
  };

  /**
   * if there are more than one nodes,
   * and any one of the node does not have a connection from source to target
   * then the flow is invalid
   */
  const validateFlow = () => {
    const sourceNodes = new Set();
    const targetNodes = new Set();

    // collect all source and target nodes
    edges.forEach(edge => {
      sourceNodes.add(edge.source);
      targetNodes.add(edge.target);
    });

    // check for nodes without source and target handles
    const nodesWithoutSourceAndTarget = nodes.filter(
      node => !sourceNodes.has(node.id) && !targetNodes.has(node.id),
    );

    console.log(nodesWithoutSourceAndTarget);

    if (nodesWithoutSourceAndTarget.length > 0) {
      alert('More than one nodes without source and target connections');
    } else {
      saveFlowToLocal();
    }
  };

  // save the flow to local storage
  const saveFlowToLocal = () => {
    localStorage.setItem('flow', JSON.stringify({nodes, edges}));
    setShowSaveAnimation(true);
  };

  /**
   * showing a saved icon when saved
   * and then hiding it after 800ms
   */
  let timeout;
  useEffect(() => {
    if (showSaveAnimation) {
      timeout = setTimeout(() => {
        setShowSaveAnimation(false);
      }, 800);
    }

    return () => clearTimeout(timeout);
  }, [showSaveAnimation]);

  // get the flow from local storage, on page load
  useEffect(() => {
    const flow = localStorage.getItem('flow');
    if (flow) {
      const {nodes, edges} = JSON.parse(flow);
      setNodes(nodes);
      setEdges(edges);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header onClickSave={validateFlow} showSaveAnimation={showSaveAnimation} />

      <div className="flex flex-row flex-grow h-full">
        <ReactFlowProvider>
          {/* left side will be reactflow component that has all the flow nodes, edges... */}
          {/* this is the flow builder canvas */}
          <div className="reactflow-wrapper w-3/4 h-full" ref={reactFlowWrapper}>
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
              onInit={setReactFlowInstance}
              // customizing nodes & edges
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              // dnd handlers
              onDrop={onDrop}
              onDragOver={onDragOver}
              // node and edges handlers
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              // selection handlers
              onNodeClick={onNodeClick}
              onPaneClick={() => setSelectedNode(null)}
              onEdgeClick={() => setSelectedNode(null)}>
              <Background />
              <Controls />
            </ReactFlow>
          </div>

          {/* right side has node panel (sidebar) to select nodes */}
          <div className="flex-grow border-s">
            <NodePanelSidebar
              selectedNode={selectedNode}
              cancelSelection={() => setSelectedNode(null)}
              updateSelectedNode={value => updateSelectedNode(value)}
            />
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
