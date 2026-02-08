
import { GoogleGenAI } from "@google/genai";
import { CloudInterpretation } from "../types";
import { getClosestAspectRatio } from "../utils/image";

/**
 * Uses Gemini 2.5 Flash Image to generate a physical entity within the cloud silhouette.
 */
export const generateTransformedCloud = async (
  resizedOriginalBase64: string,
  solidMaskBase64: string,
  interpretation: CloudInterpretation,
  width: number,
  height: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetAspectRatio = getClosestAspectRatio(width, height);

  const maskData = solidMaskBase64.split(',')[1];
  const originalData = resizedOriginalBase64.split(',')[1];

  const prompt = `ACT AS A MASTER CONCEPT ARTIST.
INPUT 1: BACKGROUND SKY PLATE.
INPUT 2: PIXEL-PERFECT STENCIL (White = Subject Area, Black = Protected Sky).

MISSION: Completely replace the clouds in Input 1 with a fully rendered "${interpretation.objectName}".

STRICT MATERIAL & POSITIONING RULES:
1. NO CLOUD TEXTURE: Render it in its TRUE natural materials (e.g., solid fur, scales, wood, fabric, or metal).
2. 1:1 STENCIL ADHERENCE: The "${interpretation.objectName}" MUST occupy the EXACT pixel coordinates of the white regions.
3. FULL VOLUME: Scale the subject so that its components fill every protrusion of the stencil.
4. LIGHTING MATCH: Match the sun direction and atmosphere of the sky plate.
5. ZERO BLEED: The black area must remain the original sky.

Visual Style: High-fidelity cinematic concept art, solid physical materials, 8k resolution, masterful lighting integration.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: originalData } },
        { inlineData: { mimeType: 'image/png', data: maskData } },
        { text: prompt },
      ],
    },
    config: {
      imageConfig: { 
        aspectRatio: targetAspectRatio 
      }
    }
  });

  let reason = "The AI engine was unable to generate an image part.";
  
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        reason = part.text;
      }
    }
  }

  if (candidate?.finishReason) {
    throw new Error(`Generation failed: ${candidate.finishReason}. ${reason}`);
  }

  throw new Error(`Cloud transformation failed: ${reason}`);
};
