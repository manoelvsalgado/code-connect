import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../../shared/lib/api'
import { getApiErrorMessage } from '../../shared/lib/error-message'
import { clearToken, getToken, setToken } from '../../shared/lib/storage'
import type { AuthResponse, User } from '../../shared/lib/types'

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    if (!getToken()) {
      setLoading(false)
      return
    }

    try {
      const response = await api.get<User>('/auth/me')
      setUser(response.data)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

  const applySession = (payload: AuthResponse) => {
    setToken(payload.access_token)
    setUser(payload.user)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      applySession(response.data)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: getApiErrorMessage(error) }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      })
      applySession(response.data)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: getApiErrorMessage(error) }
    }
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
