import { GoogleGenAI, Type } from "@google/genai";
import { OutputType, StudyAids } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The question for the front of the flashcard."
      },
      answer: {
        type: Type.STRING,
        description: "The answer for the back of the flashcard."
      },
    },
    required: ["question", "answer"],
  },
};

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { 
        type: Type.STRING,
        description: "The quiz question."
      },
      type: {
        type: Type.STRING,
        enum: ['MCQ'],
        description: "Type of question: Must be Multiple Choice (MCQ)."
      },
      options: {
        type: Type.ARRAY,
        description: "An array of 3-5 possible answers for the MCQ.",
        items: { type: Type.STRING }
      },
      answer: { 
        type: Type.STRING,
        description: "The correct answer, which must be one of the provided options."
      },
    },
    required: ["question", "type", "answer", "options"],
  },
};

export const generateStudyAids = async (text: string, outputs: OutputType[]): Promise<StudyAids> => {
  const requestedOutputs = outputs.join(', ');

  const properties: { [key: string]: any } = {};
  if (outputs.includes(OutputType.FLASHCARDS)) {
    properties.flashcards = flashcardSchema;
  }
  if (outputs.includes(OutputType.QUIZ)) {
    properties.quiz = quizSchema;
  }

  const responseSchema = {
    type: Type.OBJECT,
    properties: properties,
  };
  
  const prompt = `You are an expert academic assistant. Your task is to analyze the following text and generate the specified study materials: ${requestedOutputs}. 
  
For any quiz requested, you must ONLY generate unique Multiple Choice Questions (MCQ). Each question should be different from the others. Each question must have a set of options and a single correct answer.

Ensure the generated content is accurate and directly derived from the provided text. Format your entire response as a single JSON object that strictly adheres to the provided schema. Do not include any explanatory text, markdown formatting, or anything outside of the JSON object.

Text to analyze:
---
${text}
---
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
    },
  });

  try {
    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as StudyAids;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response:", response.text);
    throw new Error("The AI returned an invalid response. Please try again.");
  }
};
