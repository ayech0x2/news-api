import express, { Request, Response } from "express";

// News interface
interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// GET all news
app.get("/api/news", (req: Request, res: Response) => {
  return res.json([]);
});

// GET single news by ID
app.get("/api/news/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({});
});

// POST create new news
app.post("/api/news", (req: Request, res: Response) => {
  const newsData: Partial<NewsItem> = req.body;
  res.status(201).json({});
});

// PUT update news by ID
app.put("/api/news/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<NewsItem> = req.body;
  res.json({});
});

// PATCH partial update news by ID
app.patch("/api/news/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const patchData: Partial<NewsItem> = req.body;
  res.json({});
});

// DELETE news by ID
app.delete("/api/news/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(204).send();
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express News API!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
