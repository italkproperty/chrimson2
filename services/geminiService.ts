
import { GoogleGenAI } from "@google/genai";
import { BlogContent } from "../types";

// Initialize Gemini Client following coding guidelines
// Fix: Use named parameter for apiKey and obtain directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Consultant Chat ---
export const getConsultationAdvice = async (userQuery: string): Promise<string> => {
  if (!process.env.API_KEY) return "I'm sorry, the consultation AI is currently offline (Missing API Key).";

  try {
    // Fix: Select model based on task type. Basic Text Task -> 'gemini-3-flash-preview'
    const model = "gemini-3-flash-preview";
    const systemInstruction = `You are an expert business consultant for 'Chrimson Consultants' in Namibia. 
    Your tone is professional, encouraging, and concise.
    You assist Namibian entrepreneurs in choosing the right business entity (Pty Ltd, NPO, etc.) and understanding compliance (NAMFISA, NTB, BIPA).
    Key Knowledge:
    - BIPA handles business registration.
    - NAMFISA handles non-banking financial institutions.
    - NTB is for tourism.
    - CCs (Close Corporations) are legacy but still exist; Pty Ltd is standard for new companies.
    If the user asks for prices, refer to: Starter: N$ 1,500, Pty Ltd: N$ 3,850, Financial: N$ 8,500.`;

    const response = await ai.models.generateContent({
      model,
      contents: userQuery,
      config: { systemInstruction, temperature: 0.7 }
    });

    // Fix: response.text is a property, not a method
    return response.text || "I apologize, I couldn't generate a specific consultation at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please try again later or contact our human consultants directly.";
  }
};

// --- Enterprise Blog Generation Engine ---

export interface BlogGenerationParams {
  topic: string;
  audience: string;
  category: string;
  keywords: string;
  tone: string;
}

export interface GeneratedBlogResponse {
  title: string;
  seoTitle: string;
  seoDescription: string;
  content: string; // HTML
  tags: string[];
  imageSearchTerm: string;
  imageCaption: string;
}

const INTERNAL_LINKS_CONTEXT = `
Context for Internal Linking (Use these exact hrefs when mentioning these terms):
- "Pty Ltd" or "Private Company" -> <a href="/services/private-company-pty-ltd">Pty Ltd Registration</a>
- "CC" or "Close Corporation" -> <a href="/services/close-corporation-cc">Close Corporation Services</a>
- "NAMFISA" -> <a href="/services/namfisa-compliance">NAMFISA Compliance</a>
- "NTB" or "Tourism Board" -> <a href="/services/ntb-registration">NTB Registration</a>
- "Good Standing" or "Tender" -> <a href="/services/tender-compliance">Tender Compliance Packs</a>
- "Contact" or "Consultant" -> <a href="/contact">Chrimson Consultants</a>
`;

export const generateBlogPost = async (params: BlogGenerationParams): Promise<GeneratedBlogResponse | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return null;
  }

  try {
    // Fix: Select model based on task type. Complex Text Task -> 'gemini-3-pro-preview'
    const model = "gemini-3-pro-preview"; 
    
    const prompt = `
      You are the Chief Knowledge Officer and Senior Web Editor for Chrimson Consultants (Namibia).
      Your task is to generate a comprehensive, high-ranking, 1500-word blog post.

      INPUT PARAMETERS:
      - Topic: ${params.topic}
      - Audience: ${params.audience} (Namibian Context)
      - Category: ${params.category}
      - Keywords: ${params.keywords}
      - Tone: ${params.tone}

      STRICT FORMATTING & STRUCTURE RULES:
      1. **HTML Output ONLY**: Return the content as pure, semantic, clean HTML. 
         - **DO NOT** use Markdown code blocks (\`\`\`html). 
         - **DO NOT** include the H1 title in the content body (it is handled separately).
         - Allowed tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>, <img />.
      
      2. **Rich Media Integration**:
         - Insert at least 2 relevant Unsplash images EMBEDDED in the content body using this exact format:
           <img src="https://source.unsplash.com/800x600/?KEYWORD" alt="Descriptive Alt Text" class="w-full h-auto rounded-xl shadow-lg my-8 object-cover" />
         - Replace 'KEYWORD' with a single English word relevant to the paragraph (e.g., 'office', 'contract', 'namibia', 'handshake').
      
      3. **Mandatory Structure**:
         - **Introduction**: Hook the reader immediately (3-4 lines).
         - **Comparison Table**: You MUST include one HTML table comparing options (e.g., Costs, Pros/Cons, Timeframes). 
           - Table Class: class="w-full text-left border-collapse my-8"
           - Th/Td Class: class="border-b border-slate-200 p-4"
         - **Blockquotes**: Use <blockquote class="border-l-4 border-chrimson-600 pl-4 italic my-6 bg-slate-50 p-4 rounded-r text-slate-700"> for key regulatory warnings or expert tips.
         - **Lists**: Use standard <ul> or <ol> for requirements.
      
      4. **Internal Linking**:
         - ${INTERNAL_LINKS_CONTEXT}
         - Automatically hyperlink the first occurrence of these terms using the HTML provided above. Link class must be: class="text-chrimson-600 hover:text-chrimson-800 font-semibold underline decoration-chrimson-200"

      5. **Content Quality**:
         - Paragraphs must be short (3-5 lines max).
         - Specific references to Namibian laws (Companies Act 28 of 2004, BIPA, NAMRA) are required.
         - End with a strong Call to Action (CTA) pointing to the Contact page.

      OUTPUT FORMAT (JSON ONLY):
      {
        "title": "Engaging, Click-Worthy Title",
        "seoTitle": "SEO Title (Under 60 chars)",
        "seoDescription": "Meta description (Under 160 chars)",
        "content": "HTML string containing headings, paragraphs, images, tables...",
        "tags": ["tag1", "tag2", "tag3"],
        "imageSearchTerm": "Primary hero image keyword",
        "imageCaption": "Professional caption for hero image"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, 
      }
    });

    // Fix: response.text is a property
    if (response.text) {
      return JSON.parse(response.text) as GeneratedBlogResponse;
    }
    return null;

  } catch (error) {
    console.error("Blog Generation Error:", error);
    return null;
  }
};

// --- Multilingual Translation ---

export const translateBlogContent = async (
  content: BlogContent, 
  targetLang: 'de' | 'pt' | 'zh'
): Promise<BlogContent | null> => {
  if (!process.env.API_KEY) return null;

  const langNames = { de: 'German', pt: 'Portuguese', zh: 'Simplified Chinese' };
  
  try {
    // Fix: Complex Text Task -> 'gemini-3-pro-preview'
    const model = "gemini-3-pro-preview";
    const prompt = `
      You are a professional legal translator for a Namibian corporate firm.
      Translate the following blog post JSON object into ${langNames[targetLang]}.
      
      RULES:
      1. Keep HTML tags exactly as they are. Only translate the text inside.
      2. Adapt legal terms to the closest equivalent in the target language but keep specific acronyms like 'BIPA', 'NAMRA', 'Pty Ltd' in English/Original as they are proper nouns in Namibia.
      3. Maintain the professional, advisory tone.
      
      INPUT JSON:
      ${JSON.stringify(content)}

      OUTPUT JSON (Same structure):
      {
        "title": "...",
        "content": "...",
        "excerpt": "...",
        "seoTitle": "...",
        "seoDescription": "..."
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    // Fix: response.text is a property
    if (response.text) {
      return JSON.parse(response.text) as BlogContent;
    }
    return null;
  } catch (e) {
    console.error("Translation Error", e);
    return null;
  }
};
