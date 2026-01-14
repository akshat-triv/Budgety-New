import { createClient } from '@supabase/supabase-js';
import type { Transaction } from './types/transaction.types';

const supabaseUrl = 'https://eixdwmezkuzewigzdjzc.supabase.co';
const supabaseKey = `sb_publishable_IPwAk_gy9bqvbe0tUm98Aw_ljERl4Qi`;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllTransactions() {
  try {
    let { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    return transactions;
  } catch (_) {
    console.log('Error in getting transactions');
    return [];
  }
}

export async function saveNewTransactionInDB(transaction: Transaction) {
  try {
    await supabase.from('transactions').insert(transaction);
    return {
      type: 'success',
      data: transaction,
      message: 'Saved transaction successfully',
    };
  } catch (_) {
    console.log('Error in saving transaction');
    return {
      type: 'fail',
      message: 'Error in saving transaction',
    };
  }
}

export async function deleteTransactionFromDB(transactionId: string) {
  try {
    await supabase
      .from('transactions')
      .delete()
      .eq('transaction_id', transactionId);
    return {
      type: 'success',
      message: 'Deleted transaction successfully',
    };
  } catch (_) {
    console.log('Error in deleting transaction');
    return {
      type: 'fail',
      message: 'Error in deleting transaction',
    };
  }
}
