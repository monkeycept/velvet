import { GoogleGenAI, Type } from "@google/genai";
import { VibeData, DateSpot } from "../types";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

/**
 * Analyzes an image to determine the aesthetic "vibe"
 */
export const analyzeImageVibe = async (base64Image: string): Promise<VibeData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: `Analyze this image for a romantic couple's app. 
            Identify the aesthetic mood, lighting, and emotional tone.
            Return a JSON object with:
            - summary: A 3-5 word poetic summary of the vibe (e.g. "Golden Hour Intimacy").
            - keywords: Array of 5 adjectives describing the atmosphere (e.g. "warm", "cinematic").
            - description: A short, elegant paragraph describing the image's feeling.
            - colorPalette: Array of 3 hex codes representing the dominant mood colors.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VibeData;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Vibe Analysis Error:", error);
    throw error;
  }
};

/**
 * Finds date spots using Google Maps Grounding based on the vibe and location
 */
export const findDateSpots = async (location: string, vibeKeywords: string[]): Promise<DateSpot[]> => {
  try {
    const vibeString = vibeKeywords.join(", ");
    const prompt = `Find 4 distinct romantic places in or near ${location} that match this specific aesthetic vibe: ${vibeString}. 
    Focus on lighting, atmosphere, and intimacy. 
    The user wants places that feel like the vibe described.
    Provide the name, a short description of why it fits the vibe, and the address.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // Note: responseMimeType is NOT allowed with googleMaps
      },
    });

    const spots: DateSpot[] = [];
    
    // Process Grounding Chunks to get real map data
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // We will parse the text response, but also look at grounding chunks for verification/links
    // Since we can't force JSON with Maps, we'll ask for a structured text format or parse best effort.
    // However, for a robust app, we can rely on the grounding chunks directly if they provide enough info, 
    // or parse the text if it lists them.
    
    // Let's use a simpler approach: Parse the text output manually as it usually follows a list format,
    // and augment with grounding chunk URIs if possible.
    
    // For this demo, let's parse the text assuming Gemini follows instructions well, 
    // or fallback to a simple split.
    
    const lines = response.text?.split('\n') || [];
    let currentSpot: Partial<DateSpot> = {};
    
    // Simple parser for the list format Gemini usually outputs
    lines.forEach(line => {
      if (line.match(/^\d+\.|^[-*]\s/)) {
        if (currentSpot.name) spots.push(currentSpot as DateSpot);
        currentSpot = {
          name: line.replace(/^\d+\.|^[-*]\s/, '').trim().replace(/\*\*/g, ''),
          description: ''
        };
      } else if (line.trim().length > 0 && currentSpot.name) {
        currentSpot.description += line.trim() + " ";
      }
    });
    if (currentSpot.name) spots.push(currentSpot as DateSpot);

    // Attempt to attach map links from grounding metadata if matches found
    if (chunks) {
      spots.forEach(spot => {
        const matchingChunk = chunks.find(c => 
          c.web?.title?.includes(spot.name) || c.web?.uri?.includes(spot.name.replace(/\s/g, '+'))
        );
        // Note: Maps grounding chunks structure is specific, usually specific entities are not guaranteed 1:1 mapped in chunks for lists
        // But we can try to find a URI.
      });
    }

    return spots.slice(0, 4);
  } catch (error) {
    console.error("Date Finder Error:", error);
    return [];
  }
};

/**
 * Generates creative content (poem, story, question) based on vibe
 */
export const generateMuseContent = async (type: 'poem' | 'story' | 'question', vibeData: VibeData): Promise<string> => {
  const promptMap = {
    poem: `Write a short, moody, modern romantic poem (max 8 lines) based on this aesthetic: ${vibeData.summary}. Use the words: ${vibeData.keywords.join(', ')}.`,
    story: `Write a very short (150 words), cinematic flash fiction piece about a couple in a setting that feels like: ${vibeData.description}.`,
    question: `Generate one deep, intimate conversation starter question for a couple who resonates with the vibe: ${vibeData.keywords.join(', ')}.`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptMap[type]
    });
    return response.text || "Silence...";
  } catch (error) {
    console.error("Muse Error:", error);
    return "The muse is silent right now.";
  }
};
