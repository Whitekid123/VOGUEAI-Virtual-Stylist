import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generates an outfit image based on an input item and a target style.
 */
export const generateOutfitImage = async (
  baseImageBase64: string,
  style: string
): Promise<string> => {
  try {
    const prompt = `
      You are a high-end virtual fashion stylist. 
      The user has provided an image of a clothing item.
      Create a "flat-lay" fashion photography image of a complete ${style} outfit that includes this specific item.
      
      Requirements:
      1. Use the provided item as the centerpiece.
      2. Add matching accessories, shoes, and complementary clothing appropriate for a ${style} setting.
      3. The background should be clean and neutral (white, marble, or soft pastel).
      4. The style must be cohesive and aesthetically pleasing.
      5. High resolution, photorealistic top-down view.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: baseImageBase64,
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, API handles standard types
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Using standard config for generation/editing
    });

    // Extract image from response
    // The response might contain an inlineData part if it generated an image
    // Or we might need to use generateImages if we weren't doing image-to-image. 
    // However, Gemini 2.5 Flash Image supports image-to-image via generateContent.
    
    // We need to iterate parts to find the image
    let generatedImageBase64 = '';
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
       // If the model returned text instead of an image (refusal or error), throw
       const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
       if (text) console.warn("Model returned text:", text);
       throw new Error("No image generated. The model might have refused the request or returned text only.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Error generating outfit:", error);
    throw error;
  }
};

/**
 * Edits an existing image based on a text prompt.
 */
export const editOutfitImage = async (
  imageBase64: string,
  editPrompt: string
): Promise<string> => {
  try {
    // Ensure the base64 string is clean (remove data prefix if present for API call, though inlineData usually expects raw base64)
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const fullPrompt = `Edit this image: ${editPrompt}. Maintain the flat-lay style and high quality.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', 
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    let generatedImageBase64 = '';
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
       const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
       if (text) throw new Error(text);
       throw new Error("Failed to edit image.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Error editing outfit:", error);
    throw error;
  }
};
