'use client';

import React from 'react';
import NodeSelector from './NodeSelector';
import TextNodeEditor from './editors/TextNodeEditor';

export default function NodePanelSidebar({selectedNode, updateSelectedNode, cancelSelection}) {
  return (
    <div>
      {selectedNode && selectedNode.type === 'text' ? (
        <TextNodeEditor
          cancelSelection={cancelSelection}
          selectedNode={selectedNode}
          updateSelectedNode={updateSelectedNode}
        />
      ) : (
        <div className="p-4">
          <NodeSelector />
        </div>
      )}
    </div>
  );
}
