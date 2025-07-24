import express, { Request, Response, NextFunction } from "express";
import { newsService } from "./newsService";
import { cacheService } from "./cache";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  req.setTimeout(parseInt(process.env.SERVER_TIMEOUT || "15000")); 
  res.setTimeout(parseInt(process.env.SERVER_TIMEOUT || "15000")); 
  next();
});

app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET all news
app.get("/api/news", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const news = await newsService.fetchNewsFromExternalAPI(
      category as string
    );
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// GET news by author
app.get("/api/news/author/:author", async (req: Request, res: Response) => {
  try {
    const { author } = req.params;
    if (!author || author.trim().length === 0) {
      return res.status(400).json({ error: 'Author parameter is required' });
    }
    
    const news = await newsService.fetchNewsByAuthor(author);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news by author:', error);
    res.status(500).json({ error: 'Failed to fetch news by author' });
  }
});

// GET news by title
app.get("/api/news/title/:title", async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title parameter is required' });
    }
    
    const news = await newsService.fetchNewsByTitle(title);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news by title:', error);
    res.status(500).json({ error: 'Failed to fetch news by title' });
  }
});

// GET news by keywords
app.get("/api/news/keywords/:keywords", async (req: Request, res: Response) => {
  try {
    const { keywords } = req.params;
    if (!keywords || keywords.trim().length === 0) {
      return res.status(400).json({ error: 'Keywords parameter is required' });
    }
    
    const news = await newsService.fetchNewsByKeywords(keywords);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news by keywords:', error);
    res.status(500).json({ error: 'Failed to fetch news by keywords' });
  }
});

// GET single news by ID
app.get("/api/news/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || id.trim().length === 0) {
      return res.status(400).json({ error: 'Article ID is required' });
    }
    
    const news = await newsService.fetchNewsById(id);
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news item:', error);
    res.status(500).json({ error: 'Failed to fetch news item' });
  }
});


app.delete("/api/cache", (req: Request, res: Response) => {
  try {
    cacheService.clear();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "News API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      news: "/api/news",
      search: {
        byAuthor: "/api/news/author/:author",
        byTitle: "/api/news/title/:title",
        byKeywords: "/api/news/keywords/:keywords"
      },
      cache: {
        stats: "/api/cache/stats",
        clear: "DELETE /api/cache"
      }
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`News API server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`API docs: http://localhost:${port}/`);
});
