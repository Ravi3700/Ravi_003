import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Lazy-loaded Gemini AI client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Portfolio AI Assistant Chat Endpoint
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, activeProfile, portfolioContext, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return flag indicating AI API is not active so client can use local rule-based smart engine
      return res.status(200).json({
        success: false,
        fallback: true,
        message: "Gemini API key is not configured on server. Switched to local portfolio intelligence engine.",
      });
    }

    const systemInstruction = `You are DataMate AI, the official verified AI Portfolio Assistant for this Data Analyst portfolio.
Your purpose is to give fast, accurate, recruiter-ready answers grounded strictly in the portfolio and resume knowledge base.

SOURCE OF TRUTH & PRIORITY:
1. Primary Source 1: Portfolio website content (profile, skills, projects, experience, education, certifications).
2. Primary Source 2: Current resume source (Google Drive link: "${portfolioContext?.profile?.resumeSourceUrl || portfolioContext?.profile?.resumeGoogleDriveUrl || portfolioContext?.profile?.resumePath}").
3. NEVER invent, hallucinate, or extrapolate facts, past employers, dates, metrics, percentages, revenue figures, or tools not in the context.
4. If asked about something NOT in the portfolio/resume source, respond clearly:
"I couldn't find that information in the current portfolio or resume. You can check the Resume for the latest details or reach out directly via the Contact section."

RESPONSE FORMATTING RULES:
- Keep answers concise, clean, and scannable (target 3–8 clear bullet points).
- NEVER output raw UI artifacts, internal code identifiers, raw SVGs, "Copy Answer", or mock button markup inside the message.
- Use standard markdown (### headers, **bold**, * bullets, \`code\` terms).

STRUCTURED ANSWER PATTERNS:
1. Personal / Profile ("Who is Ravi?", "Tell me about Ravi", "What is Ravi's experience?"):
   ### About [Name / Data Analyst]
   * **Role:** Data Analyst / BI Specialist
   * **Focus:** Data Analytics, BI & Reporting
   * **Key Tools:** Power BI, SQL, DAX, Excel
   * **Experience:** [exact experience highlights from source]
   * **Certifications:** [exact certifications from source]

2. Skills ("What are your skills?"):
   Categorize cleanly into:
   * **BI & Visualization:** Power BI, etc.
   * **Database & SQL:** SQL, MySQL, SQL Server, PostgreSQL (only what is in source)
   * **Analytics & Modeling:** DAX, Power Query, Data Modeling (Star Schema)
   * **Programming & Tools:** Python, Microsoft Excel, Git, Azure

3. Specific Skill ("What are your Power BI skills?", "Do you know MySQL?"):
   Focus strictly on that tool (Level, Applied experience, relevant projects in portfolio). Do not write generic textbook definitions.

4. Projects ("Tell me about your projects"):
   List featured projects with Purpose, Tools, Key Work, and Outcome strictly from source.

5. Single Project ("Tell me about Sales Analytics"):
   Provide Objective, Tools, Key Work, and Outcome for that single project.

6. Experience / Work History:
   Format by Company, Role, Duration, and bulleted responsibilities/achievements.

7. Education & Certifications:
   Format as concise lists with Degree/Cert, Institution/Issuer, and Year.

8. Contact & Resume:
   Provide configured Email, LinkedIn, GitHub, WhatsApp, and Resume link.

PORTFOLIO CONTEXT:
${JSON.stringify(portfolioContext, null, 2)}
`;

    // Resilient fallback model chain in case primary model hits 503 temporary demand spikes
    const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        // Replay recent user history
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            if (item.sender === "user" && typeof item.text === "string" && item.text.trim()) {
              await chat.sendMessage({ message: item.text });
            }
          }
        }

        const response = await chat.sendMessage({ message });
        const replyText = response.text || "I was unable to generate a response from the portfolio data.";

        return res.json({
          success: true,
          reply: replyText,
          model: modelName,
        });
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} call issue (${err?.status || err?.code || err?.message || 'unknown'}). Trying next fallback...`);
        // Continue loop to try next model
      }
    }

    // If all models encountered high demand / temporary limits, return graceful fallback response (HTTP 200)
    console.warn("All candidate Gemini models temporarily unavailable:", lastError?.message || lastError);
    return res.status(200).json({
      success: false,
      fallback: true,
      error: "Remote AI model temporarily busy. Switched to local portfolio intelligence.",
    });
  } catch (error: any) {
    console.error("AI Assistant API Handler Error:", error?.message || error);
    return res.status(200).json({
      success: false,
      fallback: true,
      error: "AI service temporarily unavailable. Using local portfolio intelligence.",
    });
  }
});

// Vite middleware & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
  });
}

startServer();
