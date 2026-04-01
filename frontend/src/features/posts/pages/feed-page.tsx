import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../../shared/lib/api'
import { getApiErrorMessage } from '../../../shared/lib/error-message'
import type { PostItem } from '../../../shared/lib/types'

export function FeedPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const search = searchParams.get('search') || ''

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get<PostItem[]>('/blog-posts', {
          params: { search: search || undefined },
        })
        setPosts(response.data)
      } catch (loadError) {
        setError(getApiErrorMessage(loadError))
      } finally {
        setLoading(false)
      }
    }

    void loadPosts()
  }, [search])

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-black md:text-4xl">{t('feed.heading')}</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            const value = String(form.get('search') || '').trim()
            setSearchParams(value ? { search: value } : {})
          }}
        >
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 md:w-80"
            defaultValue={search}
            name="search"
            placeholder={t('feed.searchPlaceholder')}
          />
        </form>
      </div>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p className="text-[var(--danger)]">{error}</p>}
      {!loading && !error && posts.length === 0 && <p>{t('feed.noResults')}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            className="rounded-2xl border border-[var(--line)] bg-white p-4 transition hover:-translate-y-0.5"
            key={post.id}
            to={`/post/${post.slug}`}
          >
            <img
              alt={post.title}
              className="mb-3 h-44 w-full rounded-xl object-cover"
              src={post.cover}
            />
            <h2 className="text-xl font-black">{post.title}</h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">{post.author?.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
