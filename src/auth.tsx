import * as React from "react";
import {
  confirmSignIn,
  resetPassword,
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  JWT,
  ResetPasswordInput,
} from "aws-amplify/auth";

export interface AuthContext {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPasswd: (username: string) => Promise<void>;
  confirmLogIn: (password: string) => Promise<any>;
  user: JWT | undefined;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const checkUserSession = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user.username;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<JWT | undefined>(undefined);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () =>
    checkUserSession()
      .then(() => setIsAuthenticated(true))
      .then(() => fetchAuthSession())
      .then((session) => setUser(session?.tokens?.idToken))
      .catch(() => setIsAuthenticated(false))
      .then(() => setIsCheckingAuth(false));

  const logout = React.useCallback(async (): Promise<void>  => {
    setIsAuthenticated(false);
    await signOut();
    setIsAuthenticated(false);
    setUser(undefined);
  }, []);

  const login = React.useCallback(
    async (username: string, password: string): Promise<any>  => {
      try {
        const signinUser = await signIn({ username, password });
        setIsAuthenticated(true);
        if (signinUser.isSignedIn) {
          const { idToken } = (await fetchAuthSession()).tokens ?? {};
          setUser(idToken);
        }
        return signinUser;
      } catch (error: any) {
        setIsAuthenticated(false);
        throw error;
      } finally {
      }
    },
    []
  );

  //TBD: FIXME
  const resetPasswd = React.useCallback(async (username: string): Promise<void> => {
    try {
      const cfg = {} as ResetPasswordInput;
      cfg.username = username;
      const resetPwd = await resetPassword(cfg);
      console.log("ResetPassword: ", resetPwd);
      setIsAuthenticated(true);
    } catch (error: any) {
      throw error;
    }
  }, []);

  const confirmLogIn = React.useCallback(async (password: string): Promise<any> => {
    try {
      const signinUser = await confirmSignIn({
        challengeResponse: password,
      });
      setIsAuthenticated(true);
      if (signinUser.isSignedIn) {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        setUser(idToken);
      }
      return signinUser;
    } catch (error: any) {
      setIsAuthenticated(false);
      throw error;
    } finally {
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isCheckingAuth,
        user,
        login,
        logout,
        resetPasswd,
        confirmLogIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
