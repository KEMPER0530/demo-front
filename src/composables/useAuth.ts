import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth';

interface AuthUserState {
  username: string;
  email?: string;
}

export const useAuth = () => {
  const user = useState<AuthUserState | null>('auth-user', () => null);
  const initialized = useState<boolean>('auth-initialized', () => false);

  const isAuthenticated = computed(() => Boolean(user.value));

  const refreshUser = async () => {
    try {
      const current = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      user.value = {
        username: current.username,
        email: attrs.email,
      };
    } catch {
      user.value = null;
    } finally {
      initialized.value = true;
    }
  };

  const init = async () => {
    if (initialized.value) {
      return;
    }
    await refreshUser();
  };

  const login = async (username: string, password: string) => {
    await signIn({ username, password });
    await refreshUser();
  };

  const register = async (email: string, password: string) => {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
  };

  const activate = async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
  };

  const logout = async () => {
    await signOut();
    user.value = null;
    initialized.value = true;
  };

  return {
    user,
    initialized,
    isAuthenticated,
    init,
    refreshUser,
    login,
    register,
    activate,
    logout,
  };
};
