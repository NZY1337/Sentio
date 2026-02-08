// utils/uploadToSupabase.ts
import { supabaseClient } from "../services/supabase";
import { BadRequestException, ErrorCode } from "../middlewares/errorMiddleware";
import { SUPABASE_URL } from "../../secrets";
import { MAX_FILE_SIZE } from "./constants";

export const createStoragePath = (userId: string, identifier: string): string => {
    return `${userId}/${identifier}-${userId}-${Date.now()}`;
}

export const sanitizeFilename = (filename: string) => {
    return filename
        .toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with underscore
        .replace(/[^a-z0-9_\-\.]/g, '') // Remove all chars except a-z, 0-9, underscore, dash, dot
        .replace(/_+/g, '_')            // Replace multiple underscores with one
        .substring(0, 100);             // Optional: limit length to 100 chars
}

export async function uploadGeneratedImagesToSupabase(
    userId: string,
    imageData: { b64_json?: string }[]
): Promise<string[]> {
    if (!userId) {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "User ID is required");
    }
    
    if (!imageData || imageData.length === 0) {
        return [];
    }

    return await Promise.all(
        imageData.map(async (data, index) => {
            if (!data.b64_json) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST, `Image data is missing for image at index ${index}`);
            }

            const imageBuffer = Buffer.from(data.b64_json, "base64");
            const storagePath = createStoragePath(userId, `generated-${index}`);

            const { error } = await supabaseClient.storage.from("artura").upload(storagePath, imageBuffer, { contentType: "image/png" });

            if (error) throw new BadRequestException(ErrorCode.BAD_REQUEST, `Failed to upload generated image at index ${index} to storage.`);

            return `${SUPABASE_URL}/storage/v1/object/public/artura/${encodeURIComponent(storagePath)}`;
        })
    );
}

// Upload function
export async function uploadUploadedImagesToSupabase(
    userId: string,
    files: Express.Multer.File[]
): Promise<string[]> {
    if (!userId) {
        throw new BadRequestException(ErrorCode.BAD_REQUEST, "User ID is required");
    }
    
    if (!files || files.length === 0) {
        return [];
    }

    return await Promise.all(
        files.map(async (file, index) => {
            if (file.size > MAX_FILE_SIZE) {
                throw new BadRequestException(
                    ErrorCode.BAD_REQUEST, 
                    `File ${file.originalname} is too large (${file.size} bytes, max: ${MAX_FILE_SIZE})`
                );
            }

            const safeFileName = sanitizeFilename(file.originalname);
            const storagePath = createStoragePath(userId, `uploaded-${index}-${safeFileName}`);

            const { error } = await supabaseClient.storage
                .from("artura")
                .upload(storagePath, file.buffer, { contentType: file.mimetype });

            if (error) {
                throw new BadRequestException(ErrorCode.BAD_REQUEST, `Failed to upload original image at index ${index}`);
            }

            return `${SUPABASE_URL}/storage/v1/object/public/artura/${encodeURIComponent(storagePath)}`;
        })
    );
}

/**
 * Detect whether a given Supabase storage URL or storage path corresponds to a generated image.
 * Accepts either the full public URL returned by upload functions or the raw storage path.
 */
export const isGeneratedStoragePath = (urlOrPath: string): boolean => {
    try {
        const last = urlOrPath.split('/').pop() || urlOrPath;
        const decoded = decodeURIComponent(last);
        return decoded.includes('generated-');
    } catch (e) {
        return urlOrPath.includes('generated-');
    }
}

/**
 * Detect whether a given Supabase storage URL or storage path corresponds to an uploaded image.
 */
export const isUploadedStoragePath = (urlOrPath: string): boolean => {
    try {
        const last = urlOrPath.split('/').pop() || urlOrPath;
        const decoded = decodeURIComponent(last);
        return decoded.includes('uploaded-');
    } catch (e) {
        return urlOrPath.includes('uploaded-');
    }
}