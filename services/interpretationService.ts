
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CloudInterpretation, CloudSegment } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 3 Pro to detect multiple distinct cloud segments in an image.
 */
export const detectCloudSegments = async (base64Image: string): Promise<CloudSegment[]> => {
  const ai = getAI();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: `Detect and identify all distinct, interesting cloud shapes in this image. 
          For each cloud, provide a short label and its bounding box in [ymin, xmin, ymax, xmax] format where coordinates are normalized from 0 to 1000.
          Return the data as a JSON array of objects with "label" and "box2d".`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            box2d: { 
              type: Type.ARRAY, 
              items: { type: Type.NUMBER },
              description: "[ymin, xmin, ymax, xmax]"
            }
          },
          required: ["label", "box2d"]
        }
      }
    }
  });

  const raw = JSON.parse(response.text || "[]");
  return raw.map((item: any, index: number) => ({
    ...item,
    id: `seg-${index}-${Date.now()}`
  }));
};

/**
 * Uses Gemini 3 Flash to analyze a cloud silhouette and generate a whimsical interpretation.
 */
export const interpretCloud = async (base64Image: string, userPrompt?: string, catMode?: boolean): Promise<CloudInterpretation> => {
  const ai = getAI();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  
  let guidanceText = userPrompt 
    ? `The following is context from a conversation or a specific user sighting: "${userPrompt}". Use this as the primary inspiration.`
    : "Identify what whimsical scene these clouds most closely resemble.";

  if (catMode) {
    guidanceText += ` 
    CRITICAL: CAT MODE IS ACTIVE. 
    You MUST interpret this cloud silhouette as a cat, a group of cats, or a specific scene involving cats. 
    Be highly imaginative. Map the cat's anatomy or the entire scene's components to the provided silhouette precisely.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: `You are an imaginative observer of shapes. 
          1. Analyze the exact silhouette of the clouds. Note if there are multiple distinct shapes.
          2. ${guidanceText} 
          3. Describe the object as a SOLID, REAL entity (or a cohesive collection of entities), not just a vaporous cloud.
          4. Extract specific geometric descriptors of the edges.
          
          Provide a JSON response with objectName, a whimsical description (focus on the object's story, not its "cloud-ness"), silhouetteAnalysis, and geometric descriptors.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objectName: { type: Type.STRING, description: "The name of the reimagined subject or scene." },
          description: { type: Type.STRING, description: "A whimsical description of the reimagined subject and its activity." },
          silhouetteAnalysis: { type: Type.STRING },
          geometricDescriptors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of visual traits of the cloud's shape."
          }
        },
        required: ["objectName", "description", "silhouetteAnalysis", "geometricDescriptors"],
      },
    },
  });

  return JSON.parse(response.text);
};

/**
 * Uses Gemini 3 Pro to write a whimsical legend or myth about the reimagined object.
 */
export const generateBackstory = async (interpretation: CloudInterpretation): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Write a whimsical, brief legend or myth (about 50-80 words) about a cloud creature or scene called "${interpretation.objectName}". 
    The story should feel like ancient sky-lore. ${interpretation.description}`,
  });
  return response.text || "Once upon a time, a cloud drifted by...";
};

/**
 * Uses Gemini 2.5 Flash TTS to narrate the story.
 */
export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Narrate this sky legend with a warm, storytelling voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Could not generate audio narration.");
  return base64Audio;
};
