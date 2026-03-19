'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'super-admin' | 'admin' | 'editor' | 'customer'
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  createAccount: (data: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.errors?.[0]?.message || 'Login failed')
    }

    const data = await res.json()
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
  }, [])

  const createAccount = useCallback(
    async (data: {
      email: string
      password: string
      firstName?: string
      lastName?: string
    }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const responseData = await res.json()
        throw new Error(
          responseData.errors?.[0]?.message || 'Account creation failed',
        )
      }

      // Auto-login after account creation
      await login(data.email, data.password)
    },
    [login],
  )

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, createAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
