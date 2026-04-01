import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../../shared/lib/api'
import { getApiErrorMessage } from '../../../shared/lib/error-message'

export function CreatePostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (image && image.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no maximo 5MB.')
      return
    }

    if (image && !image.type.startsWith('image/')) {
      setError('Apenas imagens sao permitidas.')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('body', body)
      formData.append('markdown', markdown)

      if (image) {
        formData.append('image', image)
      }

      const response = await api.post<{ slug: string }>('/blog-posts', formData)
      navigate(`/post/${response.data.slug}`)
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-[var(--line)] bg-white p-6 md:p-8">
      <h1 className="text-3xl font-black">{t('post.createTitle')}</h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold">
          {t('post.title')}
          <input
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2"
            onChange={(event) => setTitle(event.target.value)}
            required
            value={title}
          />
        </label>

        <label className="block text-sm font-semibold">
          {t('post.body')}
          <textarea
            className="mt-1 min-h-28 w-full rounded-xl border border-[var(--line)] px-3 py-2"
            onChange={(event) => setBody(event.target.value)}
            required
            value={body}
          />
        </label>

        <label className="block text-sm font-semibold">
          {t('post.markdown')}
          <textarea
            className="mt-1 min-h-44 w-full rounded-xl border border-[var(--line)] px-3 py-2"
            onChange={(event) => setMarkdown(event.target.value)}
            required
            value={markdown}
          />
        </label>

        <label className="block text-sm font-semibold">
          {t('post.image')}
          <input
            accept="image/*"
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
            type="file"
          />
        </label>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button
          className="rounded-xl bg-[var(--accent)] px-4 py-2 font-bold text-white disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {t('post.submit')}
        </button>
      </form>
    </section>
  )
}
