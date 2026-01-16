import { supabase } from './transactionsController';

export async function signinNewUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      type: 'success',
      data,
      message: 'Signed up successfully',
    };
  } catch (_) {
    console.log('Error in signing up');
    return {
      type: 'fail',
      message: 'Error in signing up',
    };
  }
}

export async function saveUserDetailsToDB(
  name: string,
  email: string,
  savings: number,
  investments: number,
  current: number
) {
  try {
    await supabase.from('personal_info').insert({
      user_name: name,
      user_id: email,
      savings,
      investments,
      current,
    });
    return {
      type: 'success',
      message: 'Saved user details successfully',
    };
  } catch (_) {
    console.log('Error in saving user details');
    return {
      type: 'fail',
      message: 'Error in saving user details',
    };
  }
}

export async function loginExistingUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      type: 'success',
      data,
      message: 'Logged in successfully',
    };
  } catch (_) {
    console.log('Error in logging in');
    return {
      type: 'fail',
      message: 'Error in logging in',
    };
  }
}

export async function signoutCurrentUser() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      type: 'success',
      message: 'Signed out successfully',
    };
  } catch (_) {
    console.log('Error in signing out');
    return {
      type: 'fail',
      message: 'Error in signing out',
    };
  }
}

export async function getCurrentUser() {
  try {
    const user = supabase.auth.getUser();

    return user;
  } catch (_) {
    console.log('Error in getting current user');
    return null;
  }
}

export async function getUserDetailsFromDB(userId: string) {
  try {
    let { data: userDetails, error } = await supabase
      .from('personal_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    return userDetails;
  } catch (_) {
    console.log('Error in getting user details');
    return null;
  }
}

export async function updateUserDetailsInDB(
  userId: string,
  info_type: 'savings' | 'investments' | 'current',
  newValue: number
) {
  try {
    const updateData: { [key: string]: number } = {};
    updateData[info_type] = newValue;

    const { error } = await supabase
      .from('personal_info')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return {
      type: 'success',
      message: 'Updated user details successfully',
    };
  } catch (_) {
    console.log('Error in updating user details');
    return {
      type: 'fail',
      message: 'Error in updating user details',
    };
  }
}
