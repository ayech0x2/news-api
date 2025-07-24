import axios, { AxiosError } from "axios";
import { cacheService } from "./cache";
import { NewsItem, ExternalNewsResponse } from "./types";

class NewsService {
  private baseUrl: string;
  private apiKey: string;
  private axiosInstance;

  constructor() {
    this.baseUrl = process.env.NEWS_API_BASE_URL || "https://api.currentsapi.services/v1";
    this.apiKey = process.env.NEWS_API_KEY || "pnhYPPPDumnRJudpQcjAs_228flOJYcU4Rc6m5Q3h28pEzHn";
    
    // Configure axios with timeout and retry logic
    this.axiosInstance = axios.create({
      timeout: parseInt(process.env.REQUEST_TIMEOUT || "10000"),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NewsAPI/1.0'
      }
    });

    // Add response interceptor for better error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API request failed:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  async fetchNewsFromExternalAPI(category?: string): Promise<NewsItem[]> {
    const cacheKey = `news_${category || "general"}`;

    // Check cache first
    const cachedData = cacheService.get<NewsItem[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedData;
    }

    try {
      console.log(`Fetching from external API: ${cacheKey}`);

      const response = await this.axiosInstance.get(`${this.baseUrl}/latest-news`, {
        params: {
          apiKey: this.apiKey,
          language: "en",
          category: category || "general",
          limit: 20,
        },
      });

      const data: ExternalNewsResponse = response.data;

      if (!data.news || !Array.isArray(data.news)) {
        console.warn('Invalid response format from external API');
        return [];
      }

      const transformedNews: NewsItem[] = data.news.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.description,
        author: article.author,
        publishedAt: article.published,
        category: article.category?.[0] || "general",
      }));

      cacheService.set(cacheKey, transformedNews, 5 * 60 * 1000);
      return transformedNews;
    } catch (error) {
      console.error("Error fetching from external API:", error);
      return [];
    }
  }

  async fetchNewsByAuthor(author: string): Promise<NewsItem[]> {
    const cacheKey = `news_author_${author}`;

    // Check cache first
    const cachedData = cacheService.get<NewsItem[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for author: ${author}`);
      return cachedData;
    }

    try {
      console.log(`Fetching articles by author: ${author}`);

      const response = await this.axiosInstance.get(`${this.baseUrl}/search`, {
        params: {
          apiKey: this.apiKey,
          keywords: author,
          language: "en",
          limit: 20,
        },
      });

      const data: ExternalNewsResponse = response.data;

      if (!data.news || !Array.isArray(data.news)) {
        console.warn('Invalid response format from external API');
        return [];
      }

      // Filter articles by author name (case-insensitive)
      const authorArticles = data.news.filter(article => 
        article.author.toLowerCase().includes(author.toLowerCase())
      );

      const transformedNews: NewsItem[] = authorArticles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.description,
        author: article.author,
        publishedAt: article.published,
        category: article.category?.[0] || "general",
      }));

      cacheService.set(cacheKey, transformedNews, 5 * 60 * 1000);
      return transformedNews;
    } catch (error) {
      console.error("Error fetching articles by author:", error);
      return [];
    }
  }

  async fetchNewsByTitle(title: string): Promise<NewsItem[]> {
    const cacheKey = `news_title_${title}`;

    // Check cache first
    const cachedData = cacheService.get<NewsItem[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for title: ${title}`);
      return cachedData;
    }

    try {
      console.log(`Fetching articles by title: ${title}`);

      const response = await this.axiosInstance.get(`${this.baseUrl}/search`, {
        params: {
          apiKey: this.apiKey,
          keywords: title,
          language: "en",
          limit: 20,
        },
      });

      const data: ExternalNewsResponse = response.data;

      if (!data.news || !Array.isArray(data.news)) {
        console.warn('Invalid response format from external API');
        return [];
      }

      // Filter articles by title (case-insensitive)
      const titleArticles = data.news.filter(article => 
        article.title.toLowerCase().includes(title.toLowerCase())
      );

      const transformedNews: NewsItem[] = titleArticles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.description,
        author: article.author,
        publishedAt: article.published,
        category: article.category?.[0] || "general",
      }));

      cacheService.set(cacheKey, transformedNews, 5 * 60 * 1000);
      return transformedNews;
    } catch (error) {
      console.error("Error fetching articles by title:", error);
      return [];
    }
  }

  async fetchNewsByKeywords(keywords: string): Promise<NewsItem[]> {
    const cacheKey = `news_keywords_${keywords}`;

    // Check cache first
    const cachedData = cacheService.get<NewsItem[]>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for keywords: ${keywords}`);
      return cachedData;
    }

    try {
      console.log(`Fetching articles by keywords: ${keywords}`);

      const response = await this.axiosInstance.get(`${this.baseUrl}/search`, {
        params: {
          apiKey: this.apiKey,
          keywords: keywords,
          language: "en",
          limit: 20,
        },
      });

      const data: ExternalNewsResponse = response.data;

      if (!data.news || !Array.isArray(data.news)) {
        console.warn('Invalid response format from external API');
        return [];
      }

      const transformedNews: NewsItem[] = data.news.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.description,
        author: article.author,
        publishedAt: article.published,
        category: article.category?.[0] || "general",
      }));

      cacheService.set(cacheKey, transformedNews, 5 * 60 * 1000);
      return transformedNews;
    } catch (error) {
      console.error("Error fetching articles by keywords:", error);
      return [];
    }
  }

  async fetchNewsById(id: string): Promise<NewsItem | null> {
    const cacheKey = `news_item_${id}`;

    // Check cache first
    const cachedData = cacheService.get<NewsItem>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for news item: ${id}`);
      return cachedData;
    }

    try {
      console.log(`Fetching news item from external API: ${id}`);

      const response = await this.axiosInstance.get(`${this.baseUrl}/search`, {
        params: {
          apiKey: this.apiKey,
          keywords: id,
          language: "en",
          limit: 1,
        },
      });

      const data: ExternalNewsResponse = response.data;

      if (!data.news || data.news.length === 0) {
        return null;
      }

      const article = data.news[0];
      const newsItem: NewsItem = {
        id: article.id,
        title: article.title,
        content: article.description,
        author: article.author,
        publishedAt: article.published,
        category: article.category?.[0] || "general",
      };

      cacheService.set(cacheKey, newsItem, 10 * 60 * 1000);
      return newsItem;
    } catch (error) {
      console.error("Error fetching news item:", error);
      return null;
    }
  }

  clearCache(): void {
    cacheService.clear();
  }

}

export const newsService = new NewsService();
