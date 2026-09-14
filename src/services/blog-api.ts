import { apiRequest } from './api';
import type { BlogPost, BlogPostInput } from '../types/blog';

function unwrapData<T>(response: { data: T } | T): T {
  return typeof response === 'object' && response !== null && 'data' in response
    ? response.data
    : response;
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const response = await apiRequest<{ data: BlogPost[] } | BlogPost[]>('/api/blog');
  return unwrapData(response);
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost> {
  const response = await apiRequest<{ data: BlogPost } | BlogPost>(`/api/blog/${encodeURIComponent(slug)}`);
  return unwrapData(response);
}

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const response = await apiRequest<{ data: BlogPost[] } | BlogPost[]>('/api/blog/admin/all');
  return unwrapData(response);
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const response = await apiRequest<{ data: BlogPost } | BlogPost>('/api/blog', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return unwrapData(response);
}

export async function updateBlogPost(id: string, input: BlogPostInput): Promise<BlogPost> {
  const response = await apiRequest<{ data: BlogPost } | BlogPost>(`/api/blog/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return unwrapData(response);
}

export async function uploadBlogCover(image: File): Promise<string> {
  const body = new FormData();
  body.append('image', image);
  const response = await apiRequest<{ url: string }>('/api/blog/image', {
    method: 'POST',
    body,
  });
  return response.url;
}
