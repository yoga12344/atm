
import React from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onClear, onConfirm, confirmDisabled }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'OK'];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {keys.map((key) => {
        let bgColor = "bg-slate-800 hover:bg-slate-700";
        let onClick = () => onKeyPress(key);
        let textColor = "text-white";

        if (key === 'CLR') {
          bgColor = "bg-red-900/40 hover:bg-red-800/60";
          onClick = onClear;
          textColor = "text-red-200";
        } else if (key === 'OK') {
          bgColor = confirmDisabled ? "bg-slate-700 opacity-50 cursor-not-allowed" : "bg-emerald-900/40 hover:bg-emerald-800/60";
          onClick = confirmDisabled ? () => {} : onConfirm;
          textColor = "text-emerald-200";
        }

        return (
          <button
            key={key}
            onClick={onClick}
            className={`${bgColor} ${textColor} h-16 w-full rounded-xl flex items-center justify-center text-xl font-bold transition-all active:scale-95 shadow-lg border border-white/5`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keypad;
