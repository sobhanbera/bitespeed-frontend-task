import {Handle} from 'reactflow';

export default function CustomHandle({type, position}) {
  return (
    <Handle
      type={type}
      position={position}
      style={{
        width: 10,
        height: 10,
        background: 'white',
        border: '1px solid #000',
      }}
    />
  );
}
