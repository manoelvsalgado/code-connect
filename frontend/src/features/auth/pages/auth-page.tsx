import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth-context'

export function AuthPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const destination = (location.state as { from?: string } | null)?.from || '/'

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const result = isRegister
      ? await register(name, email, password)
      : await login(email, password)

    setSubmitting(false)

    if (!result.ok) {
      setError(result.error || 'Failed to authenticate')
      return
    }

    navigate(destination)
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-[var(--line)] bg-white p-6 md:p-10">
      <h1 className="text-3xl font-black">{t('auth.title')}</h1>
      <p className="mt-2 text-[var(--ink-muted)]">{t('auth.subtitle')}</p>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        {isRegister && (
          <label className="block text-sm font-semibold">
            {t('auth.name')}
            <input
              className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </label>
        )}

        <label className="block text-sm font-semibold">
          {t('auth.email')}
          <input
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2"
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label className="block text-sm font-semibold">
          {t('auth.password')}
          <input
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2"
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-2 font-bold text-white disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {isRegister ? t('auth.register') : t('auth.login')}
        </button>
      </form>

      <button
        className="mt-4 text-sm text-[var(--ink-muted)] underline"
        onClick={() => setIsRegister((old) => !old)}
        type="button"
      >
        {isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
      </button>
    </section>
  )
}
