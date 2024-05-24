import {AiOutlineSave} from 'react-icons/ai';
import {SiTicktick} from 'react-icons/si';

export default function Header({onClickSave, showSaveAnimation}) {
  return (
    <header className="flex flex-row justify-between items-center px-20 py-2 bg-[#f3f3f3] border-b">
      <h1 className="text-xl font-medium">Bitespeed frontend task</h1>

      <button
        className="flex items-center px-2 py-1 text-sm text-blue-500 border-2 border-blue-500 rounded-lg font-medium transition-all hover:bg-blue-500/10 active:scale-95 active:bg-blue-500/30"
        onClick={onClickSave}>
        Save Changes
        {showSaveAnimation ? (
          <SiTicktick size={28} className="pl-2" />
        ) : (
          <AiOutlineSave size={28} className="pl-2" />
        )}
      </button>
    </header>
  );
}
