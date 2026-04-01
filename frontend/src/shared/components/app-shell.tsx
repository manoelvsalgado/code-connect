import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../features/auth/auth-context'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()

  const toggleLanguage = () => {
    const next = i18n.language.startsWith('pt') ? 'en' : 'pt'
    void i18n.changeLanguage(next)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8">
      <header className="mb-8 rounded-2xl border border-[var(--line)] bg-white/80 p-4 backdrop-blur md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link className="text-xl font-black tracking-tight" to="/">
            {t('nav.brand')}
          </Link>

          <nav className="flex items-center gap-2 text-sm md:text-base">
            <NavLink className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)]" to="/">
              {t('nav.feed')}
            </NavLink>
            <NavLink className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)]" to="/create">
              {t('nav.create')}
            </NavLink>
            {!isAuthenticated && (
              <NavLink className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)]" to="/auth">
                {t('nav.login')}
              </NavLink>
            )}
            <button
              className="rounded-full border border-[var(--line)] px-3 py-1.5 hover:bg-neutral-100"
              onClick={toggleLanguage}
              type="button"
            >
              {i18n.language.startsWith('pt') ? 'EN' : 'PT'}
            </button>
            {isAuthenticated && (
              <button
                className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-white hover:opacity-90"
                onClick={logout}
                type="button"
              >
                {t('nav.logout')}
              </button>
            )}
          </nav>
        </div>
        {isAuthenticated && (
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            {user?.name} • {user?.email}
          </p>
        )}
      </header>

      <main className="pb-10">{children}</main>
    </div>
  )
}
