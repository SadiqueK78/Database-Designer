import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationSuggestion, ERFile } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

function getAIClient() {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("VITE_API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
}


export async function generateSqlFromEr(erFile: ERFile): Promise<string> {
    const ai = getAIClient();
    const prompt = `You are an expert database architect. Analyze the following Entity-Relationship Diagram and generate a complete and valid SQL schema (CREATE TABLE statements). Include primary keys, foreign keys, appropriate constraints, and sensible data types. The diagram is provided as an image or text. Output ONLY the SQL code, with no surrounding text, explanations, or markdown formatting.`;

    let parts: any[];

    if (erFile.type.startsWith('image/')) {
        parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: erFile.type,
                    data: erFile.content,
                },
            },
        ];
    } else {
        parts = [
            { text: `${prompt}\n\nER Diagram content:\n\n${erFile.content}` }
        ];
    }

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: parts },
        });
        const text = response.text.replace(/```sql\n?|```/g, '').trim();
        return text;
    } catch (error) {
        console.error("Error generating SQL from ER:", error);
        throw new Error("Failed to generate SQL. Please check the console for details.");
    }
}


export async function generateErFromSql(sql: string): Promise<string> {
    const ai = getAIClient();
    const prompt = `You are an expert database architect. Convert the following SQL schema into Mermaid.js ER Diagram syntax. Use standard ERD notation. Only output the Mermaid code block, starting with 'erDiagram'. Do not include any other text, explanations, or markdown formatting.`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `${prompt}\n\nSQL Schema:\n\n${sql}`,
        });
        const text = response.text.replace(/```mermaid\n?|```/g, '').trim();
        return text;
    } catch (error) {
        console.error("Error generating ER from SQL:", error);
        throw new Error("Failed to generate ER Diagram. Please check the console for details.");
    }
}


export async function getOptimizationSuggestions(sql: string): Promise<OptimizationSuggestion[]> {
    const ai = getAIClient();
    const prompt = `You are a world-class database performance expert (DBA). Analyze the following SQL schema and provide optimization suggestions. For each suggestion, provide a severity level.`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `${prompt}\n\nSQL Schema:\n\n${sql}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: {
                                type: Type.STRING,
                                description: "The category of the suggestion. Can be 'Normalization', 'Indexing', 'Query Optimization', 'Storage', 'Data Types', or 'Other'.",
                            },
                            suggestion: {
                                type: Type.STRING,
                                description: "A concise, actionable optimization suggestion.",
                            },
                            rationale: {
                                type: Type.STRING,
                                description: "A brief explanation of why this suggestion is beneficial.",
                            },
                            severity: {
                                type: Type.STRING,
                                description: "The severity of the suggestion: 'Critical' for major issues, 'Moderate' for important improvements, or 'Good' for minor tweaks/best practices."
                            }
                        },
                        required: ["category", "suggestion", "rationale", "severity"],
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        const suggestions = JSON.parse(jsonStr);
        return suggestions as OptimizationSuggestion[];
    } catch (error) {
        console.error("Error getting optimization suggestions:", error);
        throw new Error("Failed to get optimization suggestions. Please check the console for details.");
    }
}
