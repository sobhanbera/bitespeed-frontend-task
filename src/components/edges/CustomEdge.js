import {BezierEdge, EdgeLabelRenderer} from 'reactflow';
import {FaCaretRight} from 'react-icons/fa';

export default function CustomEdge(props) {
  const {targetX, targetY} = props;

  return (
    <>
      <BezierEdge {...props} />

      {/* render icon at the target */}
      <EdgeLabelRenderer>
        <FaCaretRight
          size={20}
          className="text-black"
          style={{
            transform: `translate(-50%, -50%) translate(${targetX}px, ${targetY}px)`,
          }}
          // transform={}
        />
      </EdgeLabelRenderer>
    </>
  );
}
