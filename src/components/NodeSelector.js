import {BiMessageSquareDetail, BiImages} from 'react-icons/bi';

const nodeTypes = [
  {
    type: 'text',
    value: 'Message',
    icon: BiMessageSquareDetail,
    disabled: true,
  },

  // NOTE: add more nodes types like above here...
  // {
  //     type: "image",
  //     value: "Image",
  //     icon: BiImages,
  //     disabled: false,
  // },
];

export default function NodeSelector({}) {
  const onDragStart = (event, node) => {
    // we'll send the type of the node to the drop event
    // so we can create a new node with the type of the dropped element
    event.dataTransfer.setData('application/reactflow', node.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <h1 className="text-lg font-medium mb-3">Select a Node</h1>

      <div className="flex flex-wrap justify-between">
        {nodeTypes.map(Node => (
          <div
            key={Node.type}
            onDragStart={event => onDragStart(event, Node)}
            draggable
            className="flex flex-col items-center justify-between p-4 my-2 bg-white border-2 border-blue-500 rounded-lg font-medium transition-all w-[48%] active:scale-95 cursor-pointer">
            <div className="rounded-full mb-5">
              <Node.icon size={24} className="text-blue-500" />
            </div>

            <span className="text-base select-none text-blue-500">{Node.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
