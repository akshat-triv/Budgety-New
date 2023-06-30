import { createClient } from '@supabase/supabase-js';
import type { Transaction } from './types/transaction.types';

const supabaseUrl = 'https://zgmcuhllwkolwubsqxoa.supabase.co';
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbWN1aGxsd2tvbHd1YnNxeG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxNzgzOTIsImV4cCI6MTk5NTc1NDM5Mn0.J5C7yrZrHt916Sn7sDo4VA5A0EiLXvNpotoMXng67Bo`;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllTransactions() {
  try {
    let { data: transactions, error } = await supabase
      .from('transactions')
      .select('*');
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
