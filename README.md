# Movie Recommendation API

A Node.js service that recommends movies using vector embeddings and cosine
similarity. Movie data is loaded from `src/resources/movies.json`.

## Setup

```bash
npm install
cp .env.example .env
```

Set your OpenRouter credentials in `.env`:

```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
PORT=3000
```

Start the server:

```bash
npm start
```

Movie embeddings are generated when the server starts and are kept in memory.

## Endpoints

Health check:

```http
GET /health
```

Recommendations from a text query:

```http
POST /recommend
Content-Type: application/json

{
  "query": "space movies about survival"
}
```

Similar movies:

```http
GET /movies/Interstellar/similar
```
