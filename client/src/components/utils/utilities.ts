import type { ProjectResponseProps } from "../../types";

// result = {
//     "project": {
//         "id": "a7ee2d7c-baba-4c6c-935e-3a1874221f7e",
//         "userId": "user_2xrVpetV8CkDDyfbJPSXmsrRe57",
//         "prompt": "create a victorian bedroom.",
//         "category": "DESIGN_GENERATOR",
//         "size": "1536x1024",
//         "quality": "high",
//         "createdAt": "2025-06-15T22:13:32.904Z",
//         "updatedAt": "2025-06-15T22:13:32.904Z"
//     },
//     "images": {
//         "count": 1
//     },
//     "imageGenerationResponse": {
//         "id": "700d1d92-5a80-4788-8cd5-5e7d5272526c",
//         "projectId": "a7ee2d7c-baba-4c6c-935e-3a1874221f7e",
//         "background": "auto",
//         "outputFormat": "png",
//         "quality": "high",
//         "size": "1536x1024",
//         "inputTokens": 12,
//         "imageTokens": 0,
//         "textTokens": 12,
//         "outputTokens": 6208,
//         "totalTokens": 6220,
//         "imageCost": 0.25,
//         "tokenCost": 0.24838,
//         "totalCost": 0.49838
//     }
// }
// {
//     "id": "d5742d14-11cf-4908-9560-b3f0760d616d",
//     "userId": "user_2xrVpetV8CkDDyfbJPSXmsrRe57",
//     "prompt": "Design a realistic, cozy study room inspired by the Gryffindor common room from the Harry Potter universe. Use rich, warm tones such as burgundy, deep gold, and dark mahogany wood throughout the furniture and decor. The room should feature vintage leather armchairs with worn textures, a large stone fireplace with a gentle, flickering fire, and tall, classic wooden bookshelves filled with old, weathered books.",
//     "category": "DESIGN_GENERATOR",
//     "size": "1536x1024",
//     "quality": "HIGH",
//     "createdAt": "2025-06-01T17:12:11.268Z",
//     "updatedAt": "2025-06-01T17:12:11.268Z",
//     "images": [
//          {
//           "id": "509edda3-29e2-431c-8d24-f13cfc5b9106",
//           "url": "https://yfyiqiqqwgdvmazcgdnv.supabase.co/storage/v1/object/public/artura/user_2xrVpetV8CkDDyfbJPSXmsrRe57/generated-user_2xrVpetV8CkDDyfbJPSXmsrRe57-1748797930045.png",
//           "projectId": "d5742d14-11cf-4908-9560-b3f0760d616d",
//           "createdAt": "2025-06-01T17:12:11.368Z"
//          }
//      ]
// },

export const mapResponseData = (data: ProjectResponseProps) => {
    const { project: { id, userId, prompt, category, size, quality, createdAt, updatedAt, background, outputFormat, designTheme, spaceType, n }, images } = data;

    return {
        id,
        userId,
        prompt,
        category,
        size,
        quality,
        createdAt,
        updatedAt,
        images,
        background,
        outputFormat,
        designTheme,
        spaceType,
        n
    };
}

export const urlToFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();

    // Extract filename from URL or create a default one
    const filename = url.split('/').pop() || `image-${Date.now()}.png`;

    // Create a File object (which extends Blob) with proper File properties
    return new File([blob], filename, {
        type: blob.type || 'image/png',
        lastModified: Date.now()
    });
};

