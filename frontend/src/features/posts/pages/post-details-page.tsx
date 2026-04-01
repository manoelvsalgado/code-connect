import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/auth-context'
import { api } from '../../../shared/lib/api'
import { getApiErrorMessage } from '../../../shared/lib/error-message'
import type { CommentItem, PostItem } from '../../../shared/lib/types'

export function PostDetailsPage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()

  const [post, setPost] = useState<PostItem | null>(null)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const postResponse = await api.get<PostItem>(`/blog-posts/slug/${slug}`)
        setPost(postResponse.data)

        const commentsResponse = await api.get<CommentItem[]>(
          `/comments/post/${postResponse.data.id}`,
        )
        setComments(commentsResponse.data)
      } catch (loadError) {
        setError(getApiErrorMessage(loadError))
      } finally {
        setLoading(false)
      }
    }

    void loadPost()
  }, [slug])

  const handleSendComment = async (event: FormEvent) => {
    event.preventDefault()

    if (!post || !commentText.trim()) {
      return
    }

    try {
      const response = await api.post<CommentItem>(`/comments/post/${post.id}`, {
        text: commentText,
      })

      setComments((current) => [response.data, ...current])
      setCommentText('')
    } catch (sendError) {
      setError(getApiErrorMessage(sendError))
    }
  }

  if (loading) {
    return <p>{t('common.loading')}</p>
  }

  if (error) {
    return <p className="text-[var(--danger)]">{error}</p>
  }

  if (!post) {
    return <p>{t('common.empty')}</p>
  }

  return (
    <article className="space-y-8">
      <section className="rounded-3xl border border-[var(--line)] bg-white p-6">
        <img alt={post.title} className="mb-4 h-72 w-full rounded-2xl object-cover" src={post.cover} />
        <h1 className="text-3xl font-black">{post.title}</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{post.author?.name}</p>
        <p className="mt-6 whitespace-pre-wrap leading-7">{post.body}</p>
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-white p-6">
        <h2 className="text-2xl font-black">{t('post.comments')}</h2>

        {isAuthenticated ? (
          <form className="mt-4 flex gap-3" onSubmit={handleSendComment}>
            <input
              className="w-full rounded-xl border border-[var(--line)] px-3 py-2"
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={t('post.writeComment')}
              value={commentText}
            />
            <button className="rounded-xl bg-[var(--ink)] px-4 py-2 text-white" type="submit">
              {t('common.send')}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-[var(--ink-muted)]">Login para comentar.</p>
        )}

        <div className="mt-6 space-y-3">
          {comments.map((comment) => (
            <div className="rounded-xl border border-[var(--line)] p-3" key={comment.id}>
              <p className="text-sm font-semibold">{comment.author?.name}</p>
              <p className="mt-1 text-sm">{comment.text}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm">{t('common.empty')}</p>}
        </div>
      </section>
    </article>
  )
}
