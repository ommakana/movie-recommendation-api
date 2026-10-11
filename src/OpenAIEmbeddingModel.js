class OpenAIEmbeddingModel {
    constructor(openaiClient, modelName) {
        this.openaiClient = openaiClient;
        this.modelName = modelName;
    }

    async embed(text) {
        const response = await this.openaiClient.embeddings.create({
            model: this.modelName,
            input: text
        });

        return response.data[0].embedding;
    }
}

module.exports = OpenAIEmbeddingModel;
