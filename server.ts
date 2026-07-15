import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Type, Schema } from "@google/genai";
import { OpenAlexService } from "./server/services/openalex.service";
import { LLMService } from "./server/services/llm.service";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        mainDiscipline: { type: Type.STRING },
        subDiscipline: { type: Type.STRING },
        studyType: { type: Type.STRING },
        methodology: { type: Type.STRING },
        suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    journals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          publisher: { type: Type.STRING },
          url: { type: Type.STRING },
          matchScore: { type: Type.INTEGER },
          metrics: {
            type: Type.OBJECT,
            properties: {
              impactFactor: { type: Type.STRING },
              quartile: { type: Type.STRING },
              apc: { type: Type.STRING },
              reviewSpeed: { type: Type.STRING },
              acceptanceRate: { type: Type.STRING },
              indexing: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.INTEGER, description: "out of 30" },
              quality: { type: Type.INTEGER, description: "out of 20" },
              acceptance: { type: Type.INTEGER, description: "out of 15" },
              speed: { type: Type.INTEGER, description: "out of 10" },
              apc: { type: Type.INTEGER, description: "out of 10" },
              publisher: { type: Type.INTEGER, description: "out of 10" },
              spread: { type: Type.INTEGER, description: "out of 5" }
            }
          },
          justification: { type: Type.STRING },
          advice: { type: Type.STRING },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  }
};

function buildPrompt(title: string, abstract: string, keywords: string, filters: any, realJournals: string) {
  return `
    You are an expert academic journal finder and research advisor.
    Analyze the following research paper details:
    Title: ${title}
    Abstract: ${abstract}
    Keywords: ${keywords}

    Filters applied by user:
    ${JSON.stringify(filters, null, 2)}

    CRITICAL INSTRUCTION - DO NOT HALLUCINATE:
    Below is a list of REAL journals fetched directly from the OpenAlex API that match the user's search criteria. 
    You MUST ONLY recommend 3 to 5 journals from THIS EXACT LIST. 
    Do NOT invent, hallucinate, or suggest any journals that are not in this list.

    REAL JOURNALS LIST:
    ${realJournals || 'No journals fetched. Suggest real, verified journals only based on your knowledge.'}

    Perform the following tasks:
    1. Analyze the research to determine the main discipline, sub-discipline, methodology, and study type. Suggest extra keywords.
    2. Recommend 3 to 5 highly relevant academic journals strictly from the REAL JOURNALS LIST above that match the user's research and filters.
    3. For each selected journal, use the provided real data (Publisher, URL, OA status, DOAJ, APC, Impact Score) to populate the metrics. If exact Review Speed or Acceptance Rate is not in the real data, you may estimate them based on your knowledge of the publisher. Include the provided URL for verification. DO NOT invent the journal name, publisher, or URL.
    4. DO NOT hallucinate the Quartile (Q1-Q4) or indexing (Scopus/WoS). If you are not absolutely sure about a journal's current quartile, set it to "Unverified" or "N/A" rather than guessing.
    5. Provide a strict suitability score (out of 100) and a breakdown of the score based on: Topic Match (max 30), Journal Quality/Impact (max 20), Acceptance Chance (max 15), Review/Publication Speed (max 10), APC/Cost suitability (max 10), Publisher Reputation (max 10), Spread/Reach (max 5). Ensure the sum of the breakdown exactly matches the matchScore.
    6. Provide actionable advice for the authors to increase their chances of acceptance in each specific journal.
    7. If a journal has any red flags (e.g., predatory behavior, very slow review times), include them in the 'warnings' array.

    Return the response strictly matching the JSON schema structure required below. Do not wrap with markdown blocks like \`\`\`json. The output should be raw JSON string parseable by JSON.parse().
    Output in Arabic Language where descriptive text is used (like justification, advice, warnings, disciplines, study type, methodology). The Journal Name, Publisher, and Indexing can remain in English/Original names.
    
    JSON SCHEMA (Strictly adhere to this structure):
    ${JSON.stringify(responseSchema, null, 2)}
  `;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/analyze", async (req, res) => {
    try {
      const { aiSettings, title, abstract, keywords, filters } = req.body;
      const realJournals = await OpenAlexService.fetchRealJournals(keywords, filters);
      const prompt = buildPrompt(title, abstract, keywords, filters, realJournals);
      
      const provider = aiSettings?.provider || 'gemini';
      const apiKey = aiSettings?.apiKey || '';
      
      const result = await LLMService.analyze(provider, apiKey, prompt, responseSchema, aiSettings?.model);
      res.json(result);
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
