export interface User {
  id: string
  email: string
  name: string
  avatar?: string | null
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface PostAuthor {
  id: string
  name: string
  avatar?: string | null
}

export interface CommentItem {
  id: number
  text: string
  postId: number
  author: PostAuthor
  createdAt: string
}

export interface PostItem {
  id: number
  title: string
  slug: string
  body: string
  markdown: string
  cover: string
  likes: number
  createdAt: string
  author: PostAuthor
  comments?: CommentItem[]
}
