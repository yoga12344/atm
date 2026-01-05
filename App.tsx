
import React, { useState, useEffect } from 'react';
import { ATMStep, UserAccount } from './types';

const MOCK_USER: UserAccount = {
  name: "User",
  balance: 50000,
  pin: "1234"
};

const WITHDRAWAL_LIMIT = 10000;

// Simplified high-fidelity SVG representations of the requested images
const CardBackVisual = () => (
  <div className="w-32 h-20 bg-[#006699] rounded-lg relative overflow-hidden shadow-md border border-gray-400">
    <div className="absolute top-2 w-full h-4 bg-black/80"></div>
    <div className="absolute top-8 left-2 w-20 h-4 bg-white/90 rounded-sm flex items-center px-1">
      <div className="w-full h-[1px] bg-gray-300"></div>
    </div>
    <div className="absolute top-8 right-2 text-[8px] text-black font-bold bg-white px-1">123</div>
    <div className="absolute bottom-2 left-2 text-[6px] text-white/50 w-24 leading-tight">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit...
    </div>
  </div>
);

const CardFrontVisual = () => (
  <div className="w-32 h-20 bg-[#006699] rounded-lg relative overflow-hidden shadow-md border border-gray-400 p-2">
    <div className="text-[8px] text-white font-bold">BANK NAME</div>
    <div className="mt-2 w-6 h-5 bg-yellow-400/80 rounded-sm border border-yellow-600"></div>
    <div className="mt-1 text-[8px] text-white font-mono tracking-widest">1234 5678 9012 3456</div>
    <div className="absolute bottom-2 right-2 w-8 h-6 bg-white/20 rounded-sm border border-white/30"></div>
    <div className="absolute bottom-1 left-2 text-[6px] text-white">CARDHOLDER NAME</div>
  </div>
);

const FanOf500Notes = () => (
  <div className="relative w-64 h-40 flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <div 
        key={i}
        className="absolute w-48 h-20 bg-[#f1f3e0] border border-[#cfd4b8] rounded-sm shadow-sm flex flex-col items-center justify-center overflow-hidden transition-transform"
        style={{ 
          transform: `rotate(${i * 8 - 16}deg) translateY(${i * 2}px)`,
          zIndex: i,
          backgroundColor: i === 4 ? '#f1f3e0' : '#e8ead0'
        }}
      >
        <div className="absolute top-1 left-1 text-[8px] text-gray-400 font-bold">500</div>
        <div className="w-[85%] h-[80%] border border-gray-200/50 flex items-center px-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"></div>
          <div className="ml-2 flex-1">
            <div className="text-xs font-bold text-gray-700">₹500</div>
            <div className="text-[6px] text-gray-500 uppercase tracking-tighter">Reserve Bank of India</div>
          </div>
        </div>
        <div className="absolute right-1 bottom-1 text-[8px] text-gray-400 font-bold">500</div>
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [step, setStep] = useState<ATMStep>(ATMStep.WELCOME);
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (step === ATMStep.PIN_ENTRY) {
      if (pin.length < 4) {
        setPin(prev => prev + num);
        setError(null);
      }
    } else if (step === ATMStep.CASH_WITHDRAWAL) {
      setAmount(prev => prev + num);
      setError(null);
    }
  };

  const handleClear = () => {
    if (step === ATMStep.PIN_ENTRY) setPin("");
    if (step === ATMStep.CASH_WITHDRAWAL) setAmount("");
    setError(null);
  };

  const handlePinSubmit = () => {
    if (pin === MOCK_USER.pin) {
      setStep(ATMStep.SELECT_TRANSACTION);
      setError(null);
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseInt(amount);
    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (withdrawAmount > WITHDRAWAL_LIMIT) {
      setError(`Daily limit reached! Max withdrawal is Rs. ${WITHDRAWAL_LIMIT.toLocaleString()}.`);
      return;
    }

    if (withdrawAmount > MOCK_USER.balance) {
      setError("Insufficient balance.");
      return;
    }

    setStep(ATMStep.PROCESSING);
    setTimeout(() => {
      setStep(ATMStep.COMPLETED);
      setError(null);
    }, 3000);
  };

  const keypadButtonClass = "w-20 h-14 bg-white border-2 border-gray-200 rounded-xl text-2xl font-bold text-gray-800 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center";

  const renderScreen = () => {
    switch (step) {
      case ATMStep.WELCOME:
        return (
          <div className="flex flex-col items-center py-12 px-6 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">WELCOME!</h2>
            <p className="text-gray-600">Please insert your ATM card</p>
            
            <div className="flex space-x-12 items-end">
              <div className="text-center group cursor-pointer" onClick={() => setStep(ATMStep.PIN_ENTRY)}>
                <CardFrontVisual />
                <p className="text-xs text-blue-600 font-bold mt-3">Good orientation</p>
              </div>
              <div className="text-center opacity-70">
                <CardBackVisual />
                <p className="text-xs text-red-500 font-bold mt-3">Wrong orientation</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep(ATMStep.PIN_ENTRY);
                setError(null);
                setPin("");
              }}
              className="bg-[#007bff] hover:bg-blue-600 text-white px-10 py-3 rounded font-semibold transition-all shadow-lg active:scale-95"
            >
              Insert Card
            </button>
          </div>
        );

      case ATMStep.PIN_ENTRY:
        return (
          <div className="flex flex-col items-center py-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Please enter your PIN</h2>
            
            <div className="flex space-x-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-blue-400 ${pin.length > i ? 'bg-blue-400' : 'bg-transparent'}`}></div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} onClick={() => handleKeyPress(n.toString())} className={keypadButtonClass}>{n}</button>
              ))}
              <div className="w-20"></div>
              <button onClick={() => handleKeyPress("0")} className={keypadButtonClass}>0</button>
              <div className="w-20"></div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold animate-pulse">{error}</p>}

            <button 
              onClick={handleClear}
              className="w-full max-w-[250px] py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-colors shadow-md active:scale-95"
            >
              Clear
            </button>

            <div className="flex space-x-4 w-full justify-center">
              <button onClick={handlePinSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2.5 rounded-lg font-bold shadow-md active:scale-95">Enter</button>
              <button onClick={() => setStep(ATMStep.WELCOME)} className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-2.5 rounded-lg font-bold shadow-md active:scale-95">Exit Card</button>
            </div>

            <div className="p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-500 font-medium text-center leading-relaxed">Default test PIN: 1234<br/>Secure session encrypted</p>
            </div>
          </div>
        );

      case ATMStep.SELECT_TRANSACTION:
        return (
          <div className="py-8 px-12">
            <h2 className="text-center text-xl font-bold mb-8 text-gray-700 uppercase tracking-wider">Select Transaction</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: 'Cash Withdrawal', step: ATMStep.CASH_WITHDRAWAL },
                { label: 'Balance Enquiry', step: ATMStep.BALANCE },
                { label: 'PIN Change', step: null },
                { label: 'Mini Statement', step: null },
                { label: 'Card Services', step: null },
                { label: 'Exit', step: ATMStep.WELCOME }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between space-x-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <button 
                    onClick={() => {
                      if (item.step) {
                        setStep(item.step);
                        setError(null);
                        setAmount("");
                      }
                    }}
                    className="bg-gray-200 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200 text-gray-600 px-4 py-1 rounded text-sm border border-gray-300 transition-all font-bold"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case ATMStep.CASH_WITHDRAWAL:
        return (
          <div className="flex flex-col items-center py-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Please enter the amount</h2>
            
            <div className="flex flex-col items-center w-full max-w-xs space-y-2">
              <div className={`flex items-center border-2 px-4 py-3 w-full bg-white rounded-xl shadow-inner transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-blue-200'}`}>
                <span className={`mr-2 font-bold text-xl ${error ? 'text-red-500' : 'text-blue-600'}`}>Rs:</span>
                <input 
                  type="text" 
                  readOnly 
                  value={amount} 
                  className="bg-transparent w-full text-2xl font-bold text-gray-800 focus:outline-none"
                  placeholder="0"
                />
              </div>
              {error && <p className="text-red-500 text-xs font-bold text-center px-4 leading-tight">{error}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00'].map(n => (
                <button key={n} onClick={() => handleKeyPress(n.toString())} className={keypadButtonClass}>{n}</button>
              ))}
              <button onClick={handleClear} className={`${keypadButtonClass} text-sm text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-300`}>Clear</button>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg w-full max-w-[280px] border border-gray-200">
              <p className="text-[10px] text-blue-500 uppercase font-bold mb-1">Limits & Denominations</p>
              <p className="text-[10px] text-gray-500">Max: Rs. {WITHDRAWAL_LIMIT.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 italic">Bills: 100 / 500 / 2000</p>
            </div>

            <div className="flex space-x-4 w-full justify-center">
              <button onClick={handleWithdraw} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-3 rounded-lg font-bold shadow-md active:scale-95 transition-all">Proceed</button>
              <button onClick={() => setStep(ATMStep.SELECT_TRANSACTION)} className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-3 rounded-lg font-bold shadow-md active:scale-95 transition-all">Cancel</button>
            </div>
          </div>
        );

      case ATMStep.BALANCE:
        return (
          <div className="flex flex-col items-center py-12 space-y-8">
            <h2 className="text-2xl font-bold text-gray-700">Balance Enquiry</h2>
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-50 text-center w-full max-w-sm shadow-xl shadow-blue-500/5">
               <p className="text-blue-500 text-xs mb-2 uppercase font-bold tracking-widest">Available Balance</p>
               <p className="text-4xl font-bold text-gray-800 tracking-tight">Rs. {MOCK_USER.balance.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setStep(ATMStep.SELECT_TRANSACTION)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
              Back to Menu
            </button>
          </div>
        );

      case ATMStep.PROCESSING:
        return (
          <div className="flex flex-col items-center py-20 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Your transaction is under Process...</h2>
            <p className="text-gray-500 font-medium">Please do not remove your card</p>
            <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        );

      case ATMStep.COMPLETED:
        return (
          <div className="flex flex-col items-center py-10 space-y-4">
            <h2 className="text-2xl font-bold text-[#344767] tracking-tight">This Transaction is Completed</h2>
            <p className="text-gray-500 font-medium">Thank you for using Lumina ATM</p>
            
            <div className="flex justify-center py-4">
              <FanOf500Notes />
            </div>

            <button 
              onClick={() => {
                setStep(ATMStep.WELCOME);
                setError(null);
                setPin("");
                setAmount("");
              }}
              className="bg-[#4285f4] hover:bg-[#3b78e7] text-white px-16 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Finish
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="atm-container">
      <div className="atm-header">
        Lumina Smart ATM
      </div>
      <div className="min-h-[520px]">
        {renderScreen()}
      </div>
      <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
        <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Digital Banking Network • Secure Session</p>
      </div>
    </div>
  );
};

export default App;
