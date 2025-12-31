export interface ITransaction {
  id: string
  name: string
  amount: number
  account: Account
  creationDate: string
  effectDate: string
  effectEndDate?: string
  periodicity: Periodicity
  type: TransactionType
}

export type Account = 'CIC' | 'Revolut' | 'Crypto.com'

export type Periodicity = 'unique' | 'mensuelle' | 'trimestrielle' | 'annuelle'

export type TransactionType = 'income' | 'expense'

export interface ITransactionForm {
  name: string
  amount: number | null
  account: Account
  effectDate: string
  effectEndDate?: string
  periodicity: Periodicity
  type: TransactionType
}
