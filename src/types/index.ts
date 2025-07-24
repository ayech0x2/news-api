// News article interface
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
}

// External API response interface
export interface ExternalNewsResponse {
  status: string;
  news: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    author: string;
    image: string;
    language: string;
    category: string[];
    published: string;
  }>;
}

// Cache item interface
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// API error response interface
export interface ApiError {
  error: string;
  message?: string;
  statusCode: number;
}

// Cache statistics interface
export interface CacheStats {
  size: number;
  keys: string[];
  hitRate?: number;
} 