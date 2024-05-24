import {IoIosArrowRoundBack} from 'react-icons/io';

/**
 * all the values of any node is stored in the data.value property
 * in case of image data... we have a different editor component
 * where it takes image input and updated the value (which is the url of the image)
 */
export default function TextNodeEditor({selectedNode, updateSelectedNode, cancelSelection}) {
  return (
    <div className="">
      <div className="mb-5 flex justify-between border-b p-4 py-2">
        <IoIosArrowRoundBack size={28} className="cursor-pointer" onClick={cancelSelection} />

        <h1 className="text-base font-medium">Message</h1>

        {/* empty container to balance the flexbox */}
        <div />
      </div>

      <div className="px-4">
        <h1 className="text-sm mb-3 text-gray-500">Edit Text</h1>

        <textarea
          className="w-full p-2 mb-3 bg-white border-2 border-blue-500 rounded-lg font-medium"
          placeholder="Type your message here..."
          value={selectedNode.data.value}
          onChange={event => updateSelectedNode(event.target.value)}
        />
      </div>
    </div>
  );
}
