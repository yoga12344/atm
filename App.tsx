
import React, { useState, useEffect } from 'react';
import { ATMStep, UserAccount } from './types';

const MOCK_USER: UserAccount = {
  name: "User",
  balance: 50000,
  pin: "1234"
};

const BankNote500 = () => (
  <div className="w-56 h-24 bg-[#e8f5e9] border-2 border-[#a5d6a7] rounded-sm shadow-md flex flex-col items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-300">
    <div className="absolute top-1 left-1 text-[8px] text-green-700 font-bold opacity-40">500</div>
    <div className="absolute bottom-1 right-1 text-[8px] text-green-700 font-bold opacity-40">500</div>
    <div className="w-[90%] h-[80%] border border-green-200/50 flex flex-col items-center justify-center bg-white/30 rounded-sm">
      <div className="text-green-800 font-bold text-2xl tracking-tighter">500</div>
      <div className="text-[10px] text-green-600 font-semibold uppercase tracking-widest mt-1">Currency Note</div>
    </div>
    {/* Decorative patterns */}
    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-green-200 opacity-20"></div>
    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-green-200 opacity-20"></div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-30"></div>
  </div>
);

const App: React.FC = () => {
  const [step, setStep] = useState<ATMStep>(ATMStep.WELCOME);
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (step === ATMStep.PIN_ENTRY && pin.length < 4) {
      setPin(prev => prev + num);
    } else if (step === ATMStep.CASH_WITHDRAWAL) {
      setAmount(prev => prev + num);
    }
  };

  const handleClear = () => {
    if (step === ATMStep.PIN_ENTRY) setPin("");
    if (step === ATMStep.CASH_WITHDRAWAL) setAmount("");
  };

  const handlePinSubmit = () => {
    if (pin === MOCK_USER.pin) {
      setStep(ATMStep.SELECT_TRANSACTION);
      setError(null);
    } else {
      setError("Incorrect PIN. Try 1234.");
      setPin("");
    }
  };

  const handleWithdraw = () => {
    if (!amount || parseInt(amount) <= 0) return;
    setStep(ATMStep.PROCESSING);
    setTimeout(() => {
      setStep(ATMStep.COMPLETED);
    }, 3000);
  };

  const renderScreen = () => {
    switch (step) {
      case ATMStep.WELCOME:
        return (
          <div className="flex flex-col items-center py-12 px-6 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">WELCOME!</h2>
            <p className="text-gray-600">Please insert your ATM card</p>
            
            <div className="flex space-x-12">
              <div className="text-center">
                <div className="w-32 h-20 bg-gray-200 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center mb-2">
                   <div className="w-24 h-4 bg-gray-400 rounded"></div>
                </div>
                <p className="text-xs text-gray-500">Good orientation</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-20 bg-gray-200 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center mb-2 rotate-180">
                   <div className="w-24 h-4 bg-gray-400 rounded"></div>
                </div>
                <p className="text-xs text-gray-500">Wrong orientation</p>
              </div>
            </div>

            <button 
              onClick={() => setStep(ATMStep.PIN_ENTRY)}
              className="bg-[#007bff] hover:bg-blue-600 text-white px-8 py-3 rounded font-semibold transition-colors"
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

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} onClick={() => handleKeyPress(n.toString())} className="w-16 h-12 bg-gray-100 border border-gray-300 rounded text-xl hover:bg-gray-200">{n}</button>
              ))}
              <div></div>
              <button onClick={() => handleKeyPress("0")} className="w-16 h-12 bg-gray-100 border border-gray-300 rounded text-xl hover:bg-gray-200">0</button>
              <div></div>
            </div>

            <button 
              onClick={handleClear}
              className="w-full max-w-[200px] py-2 bg-yellow-500 text-white rounded font-bold"
            >
              Clear
            </button>

            <div className="flex space-x-4 w-full justify-center">
              <button onClick={handlePinSubmit} className="bg-blue-500 text-white px-8 py-2 rounded font-bold">Enter</button>
              <button onClick={() => setStep(ATMStep.WELCOME)} className="bg-pink-500 text-white px-8 py-2 rounded font-bold">Exit Card</button>
            </div>

            <p className="text-xs text-gray-400">Default test PIN: 1234</p>
          </div>
        );

      case ATMStep.SELECT_TRANSACTION:
        return (
          <div className="py-8 px-12">
            <h2 className="text-center text-xl font-bold mb-8 text-gray-700">SELECT TRANSACTION</h2>
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
                    onClick={() => item.step && setStep(item.step)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-1 rounded text-sm border border-gray-300"
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
            
            <div className="flex items-center border border-gray-300 px-4 py-2 w-full max-w-xs bg-gray-50 rounded">
              <span className="text-gray-500 mr-2 font-bold">Rs:</span>
              <input 
                type="text" 
                readOnly 
                value={amount} 
                className="bg-transparent w-full text-xl font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00'].map(n => (
                <button key={n} onClick={() => handleKeyPress(n.toString())} className="w-16 h-12 bg-gray-100 border border-gray-300 rounded text-xl hover:bg-gray-200">{n}</button>
              ))}
              <button onClick={handleClear} className="w-16 h-12 bg-gray-100 border border-gray-300 rounded text-sm font-bold text-red-500 hover:bg-gray-200">Clear</button>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-blue-500 uppercase font-bold">Available Denominations:</p>
              <p className="text-[10px] text-gray-500">100.00 / 500.00 / 2000.00</p>
            </div>

            <div className="flex space-x-4 w-full justify-center">
              <button onClick={handleWithdraw} className="bg-emerald-500 text-white px-8 py-2 rounded font-bold shadow-sm">Proceed</button>
              <button onClick={() => setStep(ATMStep.SELECT_TRANSACTION)} className="bg-pink-500 text-white px-8 py-2 rounded font-bold shadow-sm">Cancel</button>
            </div>
          </div>
        );

      case ATMStep.BALANCE:
        return (
          <div className="flex flex-col items-center py-12 space-y-8">
            <h2 className="text-2xl font-bold text-gray-700">Balance Enquiry</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center w-full max-w-sm">
               <p className="text-gray-500 text-sm mb-2 uppercase">Current Balance</p>
               <p className="text-4xl font-bold text-gray-800">Rs. {MOCK_USER.balance.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setStep(ATMStep.SELECT_TRANSACTION)}
              className="bg-blue-500 text-white px-10 py-3 rounded font-bold"
            >
              Back
            </button>
          </div>
        );

      case ATMStep.PROCESSING:
        return (
          <div className="flex flex-col items-center py-20 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Your transaction is under Process...</h2>
            <p className="text-gray-500">Please wait</p>
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        );

      case ATMStep.COMPLETED:
        return (
          <div className="flex flex-col items-center py-10 space-y-6">
            <h2 className="text-3xl font-bold text-[#344767] tracking-tight">This Transaction is Completed</h2>
            <p className="text-gray-500 font-medium">Thank you for using our ATM</p>
            
            <div className="w-28 h-28 bg-[#e8f0fe] rounded-full flex items-center justify-center border border-[#d2e3fc]">
               <div className="w-14 h-14 bg-[#4285f4] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
               </div>
            </div>

            <div className="py-4">
              <BankNote500 />
            </div>

            <button 
              onClick={() => setStep(ATMStep.WELCOME)}
              className="bg-[#4285f4] hover:bg-[#3b78e7] text-white px-16 py-3.5 rounded-lg font-bold transition-all shadow-xl shadow-blue-500/30 active:scale-95"
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
        ATM
      </div>
      <div className="min-h-[480px]">
        {renderScreen()}
      </div>
      <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
        <p className="text-[10px] text-gray-400 font-medium">ATM mockup • Demo only • Works offline</p>
      </div>
    </div>
  );
};

export default App;
