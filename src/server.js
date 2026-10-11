require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");
const DemoApplication = require("./DemoApplication");
const OpenAIEmbeddingModel = require("./OpenAIEmbeddingModel");

async function createApp() {
    const apiKey =
        process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "OPENROUTER_API_KEY is not set. Add it to a .env file."
        );
    }

    const openaiClient = new OpenAI({
        apiKey,
        baseURL:
            process.env.OPENROUTER_BASE_URL ||
            "https://openrouter.ai/api/v1"
    });

    const embeddingModel = new OpenAIEmbeddingModel(
        openaiClient,
        process.env.OPENROUTER_EMBEDDING_MODEL || "openai/text-embedding-3-small"
    );

    const movieController = await DemoApplication.main(embeddingModel);
    const app = express();

    app.use(express.json());

    app.get("/health", (request, response) => {
        response.json({ status: "ok" });
    });

    app.post("/recommend", async (request, response) => {
        const query = request.body && request.body.query;

        if (typeof query !== "string" || query.trim() === "") {
            return response.status(400).json({
                error: "Request body must include a non-empty string named 'query'."
            });
        }

        try {
            const recommendations = await movieController.search(query.trim());
            return response.json({ query: query.trim(), recommendations });
        } catch (error) {
            return response.status(500).json({
                error: "Could not generate recommendations."
            });
        }
    });

    app.get("/movies/:title/similar", async (request, response) => {
        try {
            const recommendations = await movieController.similarMovies(
                request.params.title
            );

            return response.json({
                movie: request.params.title,
                recommendations
            });
        } catch (error) {
            if (error.message.startsWith("Movie not found:")) {
                return response.status(404).json({ error: error.message });
            }

            return response.status(500).json({
                error: "Could not find similar movies."
            });
        }
    });

    return app;
}

async function start() {
    const app = await createApp();
    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => {
        console.log(`Movie recommendation API running on http://localhost:${port}`);
    });
}

if (require.main === module) {
    start().catch(error => {
        console.error(error.message);
        process.exit(1);
    });
}

module.exports = { createApp, start };
