# News API

A RESTful API for fetching news articles with caching and search capabilities. Built with TypeScript, Express, and integrated with Currents API.


## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **HTTP Client**: Axios with timeout configuration
- **Caching**: Custom in-memory cache with TTL
- **External API**: Currents API for news data

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd news-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NEWS_API_KEY=your_currents_api_key_here
```

## API Endpoints

### Get All News
```http
GET /api/news?category=technology
```

### Search by Author
```http
GET /api/news/author/bbc
```

### Search by Title
```http
GET /api/news/title/technology
```

### Search by Keywords
```http
GET /api/news/keywords/artificial intelligence
```

### Get Single Article
```http
GET /api/news/{article_id}
```

### Cache Management
```http
GET /api/cache/stats
DELETE /api/cache
```

## Response Format

All endpoints return JSON responses in the following format:

```json
[
  {
    "id": "article_id",
    "title": "Article Title",
    "content": "Article description or content",
    "author": "Author Name",
    "publishedAt": "2023-12-01 10:30:00 +0000",
    "category": "technology"
  }
]
```

## Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
src/
├── index.ts          # Main application entry point
├── cache.ts          # Caching service implementation
├── newsService.ts    # External API integration
└── types/            # TypeScript type definitions
```

## Performance

- **Cache TTL**: 5 minutes for search results, 10 minutes for individual articles
- **Request Timeout**: 10 seconds for external API calls
- **Server Timeout**: 15 seconds for all requests
- **Memory Usage**: Minimal with automatic cache cleanup

## Error Handling

The API implements comprehensive error handling:

- **Timeout Protection**: Automatic fallback on slow external API responses
- **Network Errors**: Graceful degradation with empty results
- **Invalid Requests**: Proper HTTP status codes and error messages
- **Cache Failures**: Fallback to direct API calls
