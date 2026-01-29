import { GoogleGenerativeAI } from "@google/generative-ai";

export interface DrugAIInsights {
    summary: string;
    commonUses: string[];
    importantWarnings: string[];
    drugInteractions: Array<{
        drug: string;
        severity: 'Low' | 'Moderate' | 'High';
        description: string;
    }>;
    alternatives: Array<{
        name: string;
        reason: string;
    }>;
    patientAdvice: string[];
}

export const drugAIService = {
    analyzeDrugInformation: async (
        drugName: string,
        fdaUsage: string[],
        fdaSideEffects: string[]
    ): Promise<DrugAIInsights> => {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        if (!API_KEY) throw new Error("VITE_GEMINI_API_KEY not found");

        const genAI = new GoogleGenerativeAI(API_KEY);

        const prompt = `You are a medical AI assistant. Analyze this medication and provide simple, easy-to-understand information.

MEDICATION: ${drugName}

FDA APPROVED USAGE:
${fdaUsage.slice(0, 5).join('\n')}

SIDE EFFECTS:
${fdaSideEffects.slice(0, 5).join('\n')}

TASK:
Provide a JSON response with simple, point-wise information:
1. summary: A simple 1-sentence description of what the drug does
2. commonUses: 3-5 bullet points of main uses (simple language)
3. importantWarnings: 2-3 critical warnings (if any)
4. drugInteractions: array of {drug, severity, description} (top 3 major/moderate interactions)
5. alternatives: array of {name, reason} (2-3 common alternatives)
6. patientAdvice: 3-4 simple tips for patients (e.g., take with food)

IMPORTANT:
- Use VERY SIMPLE language (like explaining to a 10-year-old)
- Keep each point SHORT (max 10-15 words)
- NO medical jargon
- NO paragraphs - only short points
- Return ONLY valid JSON, no markdown`;

        // Helper to find all available models dynamically
        const getAvailableModels = async (): Promise<string[]> => {
            try {
                // Fetch valid models for this API key
                const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
                const response = await fetch(url);

                if (!response.ok) {
                    console.warn(`Failed to list models: ${response.status} ${response.statusText}`);
                    return ["gemini-1.5-flash", "gemini-2.0-flash"]; // Fallback
                }

                const data = await response.json();
                if (!data.models) {
                    return ["gemini-1.5-flash", "gemini-2.0-flash"];
                }

                // filtering for models that support generateContent
                const viableModels = data.models
                    .filter((m: any) =>
                        m.supportedGenerationMethods &&
                        m.supportedGenerationMethods.includes("generateContent")
                    )
                    .map((m: any) => m.name.replace("models/", ""));

                console.log("🤖 All Viable Models:", viableModels);
                return viableModels;
            } catch (e) {
                console.error("Error listing models:", e);
                return ["gemini-1.5-flash", "gemini-2.0-flash"];
            }
        };

        const attemptRequest = async (retries = 3, modelPriority: string[] = []): Promise<DrugAIInsights> => {
            // If no priority list, generate one dynamically based on REAL available models
            if (modelPriority.length === 0) {
                const allModels = await getAvailableModels();

                // Sort models: Flash first, then Pro, then others. prefer 1.5/2.0 versions.
                const flashModels = allModels.filter(m => m.includes('flash'));
                const proModels = allModels.filter(m => m.includes('pro') && !m.includes('vision')); // exclude vision-only if any
                const otherModels = allModels.filter(m => !m.includes('flash') && !m.includes('pro'));

                // Prioritize stable/latest versions
                const sortVersions = (a: string, b: string) => {
                    // prefer "latest" or "1.5" or "2.0"
                    const score = (str: string) => {
                        if (str.includes('1.5')) return 3;
                        if (str.includes('2.0')) return 3;
                        if (str.includes('latest')) return 2;
                        return 1;
                    };
                    return score(b) - score(a);
                };

                flashModels.sort(sortVersions);
                proModels.sort(sortVersions);

                modelPriority = [...flashModels, ...proModels, ...otherModels];

                // Fallback safeguards if list is empty for some reason
                if (modelPriority.length === 0) {
                    modelPriority = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro"];
                }

                console.log("📝 final Model Priority List:", modelPriority);
            }

            const currentModel = modelPriority[0];
            console.log(`🚀 Attempting AI Request with model: ${currentModel} (Remaining: ${modelPriority.length - 1})`);

            try {
                const model = genAI.getGenerativeModel({ model: currentModel });
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Robust JSON extraction
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                const cleanedResponse = jsonMatch ? jsonMatch[0] : responseText;

                try {
                    const parsed = JSON.parse(cleanedResponse);
                    console.log(`✅ Success with model: ${currentModel}`);
                    return parsed;
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                    console.log("Raw Response:", responseText);
                    throw new Error(`Failed to parse AI response: ${parseError}`);
                }
            } catch (error: any) {
                console.warn(`⚠️ Request failed with model ${currentModel}: ${error.message}`);

                // Universal Failover: If we have other models, ALWAYS try them on any error
                if (modelPriority.length > 1) {
                    console.warn(`🔄 Switching model from ${currentModel} -> ${modelPriority[1]}`);
                    const nextPriority = modelPriority.slice(1);
                    return attemptRequest(retries, nextPriority);
                }

                // If handling rate limit/overload on the LAST model, wait and retry
                const isRateLimit = error.message.includes('429');
                const isOverloaded = error.message.includes('503') || error.message.includes('overloaded');

                if (retries > 0) {
                    if (isRateLimit) {
                        const seconds = error.message.match(/retry in ([\d.]+)s/)?.[1] || 5;
                        const waitMs = (parseFloat(seconds) + 1) * 1000;
                        console.warn(`Quota hit on last model. Waiting ${seconds}s then retrying...`);
                        await new Promise(resolve => setTimeout(resolve, waitMs));
                        return attemptRequest(retries - 1, modelPriority);
                    }

                    if (isOverloaded) {
                        const waitMs = (4 - retries) * 1000;
                        console.warn(`Service overloaded on last model. Retrying in ${waitMs}ms...`);
                        await new Promise(resolve => setTimeout(resolve, waitMs));
                        return attemptRequest(retries - 1, modelPriority);
                    }
                }

                console.error(`Drug AI Analysis Error (Final):`, error);

                // Return fallback on error with reason
                return {
                    summary: `AI analysis unavailable (${error.message || 'Unknown error'}).`,
                    commonUses: [],
                    importantWarnings: [],
                    drugInteractions: [],
                    alternatives: [],
                    patientAdvice: []
                };
            }
        };

        return await attemptRequest();
    }
};
