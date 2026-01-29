import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIExtractionResult {
    additionalEntities: {
        conditions: string[];
        medications: string[];
        vitals: string[];
    };
    drugInteractions: Array<{
        drugs: string[];
        severity: 'Low' | 'Moderate' | 'High' | 'Critical';
        explanation: string;
    }>;
    clinicalInsights: string;
    recommendations: string[];
    riskAssessment: {
        overallRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
        reasoning: string;
    };
}

export const medicalAIService = {
    analyzeClincalNote: async (
        clinicalNote: string,
        extractedConditions: string[],
        extractedMedications: string[],
        extractedVitals: string[]
    ): Promise<AIExtractionResult> => {
        if (!genAI) throw new Error("AI not initialized");

        const getBestModel = async () => {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();
                const flashModels = data.models.filter((m: any) =>
                    m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent')
                );
                return flashModels.length > 0 ? flashModels[flashModels.length - 1].name.split('/').pop() : "gemini-2.0-flash";
            } catch {
                return "gemini-2.0-flash";
            }
        };

        const modelName = await getBestModel();

        const prompt = `You are a clinical AI assistant specialized in medical record analysis. Analyze the following clinical note and provide structured insights.

CLINICAL NOTE:
${clinicalNote}

ALREADY EXTRACTED (by rule-based system):
- Conditions: ${extractedConditions.join(', ') || 'None'}
- Medications: ${extractedMedications.join(', ') || 'None'}
- Vitals: ${extractedVitals.join(', ') || 'None'}

TASK:
Provide a JSON response with the following structure:

{
  "additionalEntities": {
    "conditions": ["any medical conditions NOT in the extracted list, including abbreviations like HTN, DM2, CAD"],
    "medications": ["any medications NOT in the extracted list, including brand names and uncommon drugs"],
    "vitals": ["any vital signs NOT in the extracted list, including HR, temp, SpO2, etc."]
  },
  "drugInteractions": [
    {
      "drugs": ["Drug1", "Drug2"],
      "severity": "High",
      "explanation": "Brief explanation of the interaction and clinical significance"
    }
  ],
  "clinicalInsights": "A 2-3 sentence natural language summary of the patient's overall clinical status, key concerns, and notable patterns",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "riskAssessment": {
    "overallRisk": "Moderate",
    "reasoning": "Brief explanation of the overall risk level considering all factors"
  }
}

IMPORTANT:
- Only include NEW entities not already extracted
- Focus on clinically significant interactions
- Keep insights concise and actionable
- Use medical terminology appropriately
- Return ONLY valid JSON, no markdown formatting`;

        const attemptRequest = async (retries = 2): Promise<AIExtractionResult> => {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Clean up response - remove markdown code blocks if present
                const cleanedResponse = responseText
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();

                const parsed = JSON.parse(cleanedResponse);
                return parsed;
            } catch (error: any) {
                if (error.message.includes('429') && retries > 0) {
                    const seconds = error.message.match(/retry in ([\d.]+)s/)?.[1] || 20;
                    const waitMs = (parseFloat(seconds) + 2) * 1000;
                    console.warn(`Quota hit. Sleeping for ${seconds}s then retrying...`);
                    await new Promise(resolve => setTimeout(resolve, waitMs));
                    return attemptRequest(retries - 1);
                }
                console.error('AI Analysis Error:', error);
                // Return empty result on error
                return {
                    additionalEntities: { conditions: [], medications: [], vitals: [] },
                    drugInteractions: [],
                    clinicalInsights: "AI analysis unavailable. Using rule-based extraction only.",
                    recommendations: [],
                    riskAssessment: { overallRisk: 'Low', reasoning: 'Unable to perform AI risk assessment' }
                };
            }
        };

        return await attemptRequest();
    }
};
