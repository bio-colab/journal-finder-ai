import { GoogleGenAI } from "@google/genai";

export class LLMService {
  private static normalizeResponse(data: any) {
    if (!data) data = {};
    if (!data.analysis) {
      data.analysis = {
        mainDiscipline: "N/A",
        subDiscipline: "N/A",
        studyType: "N/A",
        methodology: "N/A",
        suggestedKeywords: []
      };
    } else {
      if (!Array.isArray(data.analysis.suggestedKeywords)) {
        data.analysis.suggestedKeywords = [];
      }
    }
    if (!Array.isArray(data.journals)) {
      data.journals = [];
    }
    data.journals = data.journals.map((j: any) => ({
      ...j,
      name: j.name || "Unknown",
      publisher: j.publisher || "Unknown",
      url: j.url || "",
      metrics: {
        ...j.metrics,
        indexing: Array.isArray(j.metrics?.indexing) ? j.metrics.indexing : [],
      },
      breakdown: j.breakdown || {},
      warnings: Array.isArray(j.warnings) ? j.warnings : []
    }));
    return data;
  }

  static async analyze(provider: string, apiKey: string, prompt: string, schema: any, model?: string) {
    let result: any;
    try {
      if (provider === 'mistral') {
        if (!apiKey) throw new Error("Mistral API key is required");
        result = await this.callMistral(apiKey, prompt);
      } else if (provider === 'openrouter') {
        if (!apiKey) throw new Error("OpenRouter API key is required");
        result = await this.callOpenRouter(apiKey, model, prompt);
      } else {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) throw new Error("Gemini API key is required");
        result = await this.callGemini(key, prompt, schema);
      }
      return this.normalizeResponse(result);
    } catch (e: any) {
      console.error("LLM Service Error:", e);
      throw new Error(`AI Analysis failed: ${e.message}`);
    }
  }

  private static async callGemini(apiKey: string, prompt: string, schema: any) {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);
  }

  private static async callMistral(apiKey: string, prompt: string) {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });
    if (!response.ok) throw new Error(`Mistral API Error: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private static async callOpenRouter(apiKey: string, model: string = "anthropic/claude-3-opus", prompt: string) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });
    if (!response.ok) throw new Error(`OpenRouter API Error: ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}
