import { createClient } from '@supabase/supabase-js';
import type { Transaction } from './types/transaction.types';
import { NotificationTypes } from './types/application.types';

const supabaseUrl = 'https://eixdwmezkuzewigzdjzc.supabase.co';
const supabaseKey = `sb_publishable_IPwAk_gy9bqvbe0tUm98Aw_ljERl4Qi`;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllTransactions() {
  try {
    let { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

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
      type: 'success' as NotificationTypes,
      data: transaction,
      message: 'Saved transaction successfully',
    };
  } catch (_) {
    console.log('Error in saving transaction');
    return {
      type: 'error' as NotificationTypes,
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
      type: 'success' as NotificationTypes,
      message: 'Deleted transaction successfully',
    };
  } catch (_) {
    console.log('Error in deleting transaction');
    return {
      type: 'error' as NotificationTypes,
      message: 'Error in deleting transaction',
    };
  }
}
