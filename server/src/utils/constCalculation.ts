import type { ImagesResponse, ImageEditParams } from "openai/resources/images";
import { BadRequestException } from "../middlewares/errorMiddleware";

type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";
type ImageQuality = "low" | "medium" | "high";
type ImageModel = "gpt-image-1";

type SingleImagePrice = {
  [model in ImageModel]: {
    [quality in ImageQuality]: {
      [size in ImageSize]: number;
    };
  };
};

// pricing for GPT-image-1
const TOTAL_TOKENS: number                   = 1000000; // Cost per million tokens for GPT-image-1
const TEXT_INPUT_TOKENS_PRICE: number        = 5;       // $5 per TOTAL_TOKENS tokens for GPT-image-1
const TEXT_INPUT_CACHED_TOKENS_PRICE: number = 1.25;    // $1.25 per TOTAL_TOKENS tokens for GPT-image-1
const IMAGE_INPUT_TOKENS_PRICE: number       = 10;      // $10 per TOTAL_TOKENS input tokens for GPT-image-1
const IMAGE_CACHED_TOKENS_PRICE: number      = 2.5;     // $2.50 per TOTAL_TOKENS cached tokens for GPT-image-1
const IMAGE_OUTPUT_TOKENS_PRICE: number      = 40;      // $40 per TOTAL_TOKENS output tokens for GPT-image-1

const SINGLE_TOKEN_PRICE = {
  text: {
    input: TEXT_INPUT_TOKENS_PRICE / TOTAL_TOKENS,
    cached: TEXT_INPUT_CACHED_TOKENS_PRICE / TOTAL_TOKENS,
  },
  image: {
    input: IMAGE_INPUT_TOKENS_PRICE / TOTAL_TOKENS,
    cached: IMAGE_CACHED_TOKENS_PRICE / TOTAL_TOKENS,
    output: IMAGE_OUTPUT_TOKENS_PRICE / TOTAL_TOKENS,
  },
};
 
// pricing per image Generation
const SINGLE_IMAGE_PRICE: SingleImagePrice = {
    "gpt-image-1": {
        low: {
        "1024x1024": 0.011,
        "1024x1536": 0.016,
        "1536x1024": 0.016,
        },
        medium: {
        "1024x1024": 0.042,
        "1024x1536": 0.063,
        "1536x1024": 0.063,
        },
        high: {
        "1024x1024": 0.167,
        "1024x1536": 0.25,
        "1536x1024": 0.25,
        },
    },
};

// must be used inside try/catch block or call it as this: if (costPerImage({model, quality, size}) !== undefined)
const imagePricing = ({ model, quality, size }: {
    model: ImageEditParams["model"];
    quality: ImageEditParams["quality"];
    size: ImageEditParams["size"];
}): number => {
    const price = SINGLE_IMAGE_PRICE?.[model as ImageModel]?.[quality as ImageQuality]?.[size as ImageSize];

    if (price === undefined) {
        throw new BadRequestException(400, `Invalid combination: model="${model}", quality="${quality}", size="${size}"`);
    }

    return price;
};

/**
usage: {
    input_tokens: 95,
    input_tokens_details: { 
        image_tokens: 0, 
        text_tokens: 95
    },
    output_tokens: 6208,
    total_tokens: 6303
}
 * Calculate image generation cost based on token usage.
 * @param usage - The token usage data returned by OpenAI API
 * @param useCache - Whether this request used cached prompt/image (affects pricing)
 * @returns Total cost in USD
 */

export const calculateImageGenerationCost = ( imgResponseData: any, useCache = false): {
  tokenCost: number;
  imageCost: number;
  totalCost: number;
} => {
    const { model, quality, size, input_tokens_details: { image_tokens, text_tokens }, output_tokens } = imgResponseData;

    const textInputPrice  = useCache ? SINGLE_TOKEN_PRICE.text.cached : SINGLE_TOKEN_PRICE.text.input;
    const imageInputPrice = useCache ? SINGLE_TOKEN_PRICE.image.cached : SINGLE_TOKEN_PRICE.image.input;
    const tokenCost       = text_tokens * textInputPrice + image_tokens * imageInputPrice + output_tokens * SINGLE_TOKEN_PRICE.image.output;
    const imageCost       = imagePricing({ model, quality, size });

    const totalCost = tokenCost + imageCost;
    return { tokenCost, imageCost, totalCost };
};
