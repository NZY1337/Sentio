import OpenAI from "openai";
import { OPENAI_API_KEY, OPENAI_PROJECT_ID } from "../../../secrets";
import { openaiToFile, sizeMap, qualityMap } from "../../utils";

// types 
import type { OpenAIImageResponse, GenerateImageParams, EditImageParams } from "../../../types";

export const openAiClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
    project: OPENAI_PROJECT_ID,
});

// constants / utils
import { MODEL_NAME, BACKGROUND_MODE } from "../../utils/constants";

export const openaiService = {
    generate: async ({ prompt, n, size, quality }: GenerateImageParams): Promise<OpenAIImageResponse> => {
        const response = await openAiClient.images.generate({
            model: MODEL_NAME,
            prompt,
            n,
            size: sizeMap[size],
            quality: qualityMap[quality],
            background: BACKGROUND_MODE,
        });

        return response as OpenAIImageResponse;
    },

    edit: async ({ prompt, n, size, quality, files }: EditImageParams): Promise<OpenAIImageResponse> => {
        const response = await openAiClient.images.edit({
            model: MODEL_NAME,
            prompt,
            n,
            size: sizeMap[size],
            quality: qualityMap[quality],
            background: BACKGROUND_MODE,
            image: await openaiToFile(files) ,
        });

        return response as OpenAIImageResponse;
    }
};