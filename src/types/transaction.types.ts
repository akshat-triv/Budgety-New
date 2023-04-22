export type Transaction = {
  type: 'Credited' | 'Debited';
  description: string;
  amount: number;
  tag: string;
  date: string;
};
