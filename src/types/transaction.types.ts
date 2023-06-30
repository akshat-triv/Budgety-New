export type Transaction = {
  type: 'Credited' | 'Debited';
  description: string;
  amount: number;
  tag: string;
  date: string;
  id?: number;
  transaction_id: string;
};
