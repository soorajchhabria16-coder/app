import { GoogleGenAI, Type } from "@google/genai";
import { TwinAttributes } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getMockTwinAnalysis = (): { attributes: TwinAttributes; suggestedGenres: string[] } => {
  return {
    attributes: {
      ageRange: "25-30",
      ethnicity: "Cybernetic Construct",
      gender: "Fluid",
      hairStyle: "Neon Fiber Optic",
      distinctiveFeatures: ["Holographic Skin", "Geometric Circuitry", "Violet Iris Glow"]
    },
    suggestedGenres: ["Sci-Fi", "Cyberpunk", "Futuristic Thriller"]
  };
};

// Analyze an uploaded image to extract physical attributes for the Twin
export const analyzeTwinImage = async (base64Image: string): Promise<{ attributes: TwinAttributes; suggestedGenres: string[] }> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Analyze this person's appearance for a digital extra casting database. 
      Be objective and professional. 
      Estimate age range (e.g., "25-30"), ethnicity/skin tone description, gender presentation, hair style, and list 3 distinctive features (e.g., "high cheekbones", "piercing eyes", "freckles").
      Also suggest 3 film genres this look would be perfect for (e.g., "Cyberpunk", "Period Drama", "Corporate Thriller").
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            attributes: {
              type: Type.OBJECT,
              properties: {
                ageRange: { type: Type.STRING },
                ethnicity: { type: Type.STRING },
                gender: { type: Type.STRING },
                hairStyle: { type: Type.STRING },
                distinctiveFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["ageRange", "ethnicity", "gender", "hairStyle", "distinctiveFeatures"]
            },
            suggestedGenres: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("The AI model returned an empty response.");
    return JSON.parse(text);

  } catch (error: any) {
    console.error("Gemini Image Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze image. Please check your connection or API key.");
  }
};

// Generate a cinematic bio for the Twin
export const generateTwinBio = async (attributes: TwinAttributes, name: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Write a short, compelling, and professional casting bio (max 50 words) for a digital twin named ${name}.
      Attributes: ${attributes.ageRange}, ${attributes.ethnicity}, ${attributes.gender}, ${attributes.hairStyle}.
      Features: ${attributes.distinctiveFeatures.join(", ")}.
      The tone should be sophisticated and suitable for high-end film production.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    if (!response.text) throw new Error("Failed to generate bio content.");
    return response.text;
  } catch (error: any) {
    console.error("Gemini Bio Generation Error:", error);
    throw new Error("Failed to generate bio. Please try again.");
  }
};

// SEARCH GROUNDING: Fetch trending aesthetics
export const getTrendingCastingThemes = async (): Promise<string[]> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Identify 5 currently trending visual aesthetics or character archetypes in major sci-fi, fantasy, and action film productions for 2024-2025. Return ONLY a simple JSON array of strings.",
      config: {
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    if (response.text) return JSON.parse(response.text);
    return ["Cyberpunk", "Neo-Noir", "Post-Apocalyptic", "High Fantasy", "Space Opera"];
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return ["Dystopian", "Solarpunk", "Corporate Future", "Historical Fiction", "Space Western"]; // Fallback
  }
};

// THINKING MODE: Generate Career Strategy
export const generateCareerStrategy = async (attributes: TwinAttributes): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a high-level talent agent. Analyze these digital twin attributes: ${JSON.stringify(attributes)}. 
        Provide a strategic career assessment (max 100 words). Identify unique selling points, potential typecasting risks, and a recommended niche market.`,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text || "Strategic analysis unavailable.";
};

// VEO: Generate Motion Test Video
export const generateMotionTest = async (imageBase64: string): Promise<string> => {
    const ai = getAiClient();
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: "A cinematic, photorealistic shot of this character looking around slowly, subtle breathing, high quality, 4k, dramatic lighting.",
        image: {
            imageBytes: imageBase64,
            mimeType: 'image/jpeg'
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    // Poll for completion
    while (!operation.done) {
        await new Promise(r => setTimeout(r, 5000));
        operation = await ai.operations.getVideosOperation({operation});
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error("Video generation failed to return a URI.");

    // Fetch the video blob using the API key
    const apiKey = process.env.API_KEY; 
    const response = await fetch(`${uri}&key=${apiKey}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};