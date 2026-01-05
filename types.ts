
export enum ATMStep {
  WELCOME = 'WELCOME',
  PIN_ENTRY = 'PIN_ENTRY',
  SELECT_TRANSACTION = 'SELECT_TRANSACTION',
  CASH_WITHDRAWAL = 'CASH_WITHDRAWAL',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  BALANCE = 'BALANCE'
}

export interface UserAccount {
  name: string;
  balance: number;
  pin: string;
}
