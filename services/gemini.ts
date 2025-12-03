
import { GoogleGenAI } from "@google/genai";

// Initialize AI with the environment variable, local storage key, or the provided fallback.
const getAI = () => {
  const envKey = process.env.API_KEY;
  const localKey = localStorage.getItem('gemini_api_key');
  // Fallback key provided by user request
  const fallbackKey = 'AIzaSyD2LOhBWExmbvEuNUk0rzEWfyfKUcnkP6M';
  
  const apiKey = (envKey && envKey !== 'undefined' && !envKey.includes('%%')) 
    ? envKey 
    : (localKey || fallbackKey);

  if (!apiKey) {
    throw new Error("API Key not found. Please set it in Settings.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateCodeSnippet = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are an expert Frontend Developer. Your task is to generate complete, functional, single-file HTML applications.",
      },
      contents: `Create a fully functional, self-contained HTML/CSS/JS tool based on this description: "${prompt}".

      Requirements:
      1. Single HTML file.
      2. Modern, clean UI. Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) for styling.
      3. Functional JavaScript logic inside <script> tags.
      4. Responsive design.
      5. Error handling where appropriate.
      6. Output ONLY the raw HTML code. Do NOT wrap in markdown code blocks (like \`\`\`html). Do not output any conversational text.`,
    });
    
    let text = response.text || '';
    
    // Post-processing to remove potential markdown wrapping
    text = text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    
    return text.trim() || '<!-- No code generated -->';
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("API Key")) return "Error: Please set your Google Gemini API Key in Settings.";
    return `<!-- Error generating code: ${error.message} -->`;
  }
};

export const generatePluginCode = async (name: string, description: string, requirements: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are an expert WordPress Plugin Developer. Your task is to generate secure, functional, and complete PHP code for WordPress plugins.",
      },
      contents: `Create a WordPress plugin based on the following details:
      
      Plugin Name: ${name}
      Description: ${description}
      Functionality Requirements: ${requirements}

      Requirements:
      1. Output VALID PHP code.
      2. Include the Standard Plugin Header Comment block (Plugin Name, Description, Version: 1.0.0, Author: ToolMaster AI, License: GPL2).
      3. Add 'defined( "ABSPATH" ) || exit;' for security at the top.
      4. Follow WordPress Coding Standards (hooks, sanitation, translation-ready).
      5. If adding shortcodes or widgets, ensure they are properly registered.
      6. If adding admin pages, use 'add_menu_page'.
      7. Output ONLY the raw PHP code. Do NOT wrap in markdown code blocks (like \`\`\`php). Do not output any conversational text.`,
    });
    
    let text = response.text || '';
    
    // Post-processing to remove potential markdown wrapping
    text = text.replace(/^```php\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    
    return text.trim();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("API Key")) return "Error: Please set your Google Gemini API Key in Settings.";
    return `<?php\n// Error generating plugin: ${error.message}\n?>`;
  }
};

export const refinePluginCode = async (
  currentCode: string, 
  instruction: string, 
  meta: { name: string, description: string }
): Promise<{ text: string, code?: string }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are an expert WordPress Plugin Developer and helpful AI assistant. You help users build and refine WordPress plugins.",
      },
      contents: `
      Context:
      Plugin Name: ${meta.name}
      Description: ${meta.description}

      Current PHP Code:
      ${currentCode || '// No code yet'}

      User Instruction:
      ${instruction}

      Task:
      1. If the user is asking for code changes, generate the FULL updated PHP file content.
      2. If the user is just asking a question, answer it.
      3. WRAP any generated PHP code in \`\`\`php ... \`\`\` markdown blocks.
      4. Provide a brief, friendly explanation of changes outside the code block.
      5. Ensure code is secure (ABSPATH check) and follows WP standards.
      `,
    });

    const rawText = response.text || '';
    
    // Extract code block
    const codeMatch = rawText.match(/```php([\s\S]*?)```/);
    let code = codeMatch ? codeMatch[1].trim() : undefined;
    
    // Extract text (remove the code block from the message to keep chat clean)
    let text = rawText.replace(/```php[\s\S]*?```/g, '[Code Updated]').trim();

    // Fallback if no specific php block but looks like code
    if (!code && rawText.includes('<?php')) {
        // Simple heuristic if the model forgot markdown
        if (rawText.trim().startsWith('<?php')) {
            code = rawText;
            text = "Here is the generated code.";
        }
    }

    return { text, code };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMsg = "Error processing request.";
    if (error.message.includes("API Key")) errorMsg = "Error: Please set your API Key.";
    return { text: errorMsg };
  }
};

export const performOCR = async (base64Image: string): Promise<string> => {
  try {
    const ai = getAI();
    // Default to jpeg if not found
    let mimeType = 'image/jpeg';
    let data = base64Image;

    // Detect mime type from data URI scheme (e.g. data:image/png;base64,...)
    if (base64Image.includes(';base64,')) {
        const parts = base64Image.split(';base64,');
        mimeType = parts[0].replace('data:', '');
        data = parts[1];
    } else if (base64Image.includes(',')) {
        // Fallback for other data URI formats
        const parts = base64Image.split(',');
        if (parts[0].includes(':') && parts[0].includes(';')) {
             mimeType = parts[0].split(':')[1].split(';')[0];
        }
        data = parts[1];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: "Extract all text from this image. Return only the text, no conversational filler. Preserve line breaks and basic layout where possible." }
        ]
      }
    });
    return response.text || '';
  } catch (error: any) {
    console.error("OCR Error:", error);
    if (error.message.includes("API Key")) return "Error: Please set your Google Gemini API Key in Settings.";
    return "Error extracting text. Please ensure the image is clear and your API Key is set.";
  }
};

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || '';
  } catch (error: any) {
    console.error("GenAI Error:", error);
    if (error.message.includes("API Key")) return "Error: Please set your API Key in Settings.";
    return "Error processing request. Check API Key.";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            // No special config needed for basic generation
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Generation Error:", error);
        return null;
    }
};

// Helper for other components if they need to check existence (optional)
export const getApiKey = (): string => {
    const local = localStorage.getItem('gemini_api_key');
    if (local) return local;
    const env = process.env.API_KEY;
    if (env && env !== 'undefined' && !env.includes('%%')) return env;
    return 'AIzaSyD2LOhBWExmbvEuNUk0rzEWfyfKUcnkP6M'; // Fallback
};
