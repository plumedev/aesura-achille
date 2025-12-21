export interface IExpense {
  id: string
  name: string
  amount: number
  account: Account
  date: string
  type: string
}

export type Account = 'CIC' | 'Revolut' | 'Crypto.com'
