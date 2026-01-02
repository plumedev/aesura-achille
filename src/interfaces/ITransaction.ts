export interface ITransaction {
  id: string
  name: string
  amount: number
  type: string
  account: string
  frequency: string
  effectDate: string
  effectEndDate?: string
}
