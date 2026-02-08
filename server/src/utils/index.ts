import { toFile } from "openai";

// types
import type { FileLike } from "openai/uploads";

// middleware
import { BadRequestException, ErrorCode } from "../middlewares/errorMiddleware";


export * from "./constCalculation";
import { ImagesResponse } from "openai/resources/images";
export * from "./uploadToSupabaseStorage";
export * from "./constants";

export const hasValidImageData = (data: ImagesResponse['data'] | undefined): data is Required<ImagesResponse['data']> => {
    return Array.isArray(data) && !!data[0]?.b64_json;
};

export const isValidUsage = (usage: ImagesResponse.Usage | undefined): usage is Required<ImagesResponse.Usage> => {
    return (
        usage !== undefined &&
        usage.input_tokens !== undefined &&
        usage.output_tokens !== undefined &&
        usage.total_tokens !== undefined &&
        usage.input_tokens_details?.image_tokens !== undefined &&
        usage.input_tokens_details?.text_tokens !== undefined
    );
};

export const openaiToFile = async (files: Express.Multer.File[]):  Promise<FileLike[]> => {
    let images: FileLike[] = [];

    if (Array.isArray(files) && files.length > 0) {
        const openAiFiles = await Promise.all(
            files.map((file) =>
                toFile(file.buffer, file.originalname, {
                    type: file.mimetype,
                })
            )
        );

        images = [...openAiFiles]
    } else {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "No files uploaded.");
    }

    return images;
};


