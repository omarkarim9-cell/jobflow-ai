// api/cover-letter.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[COVER-LETTER] HANDLER START, NODE_ENV =', process.env.NODE_ENV, 'method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, company, description, resume, name, email } = req.body as {
      title: string;
      company: string;
      description: string;
      resume: string;
      name: string;
      email: string;
    };

    if (!title || !description || !resume || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isPlaceholder =
      !company ||
      company.toLowerCase().includes('review') ||
      company.toLowerCase().includes('unknown') ||
      company.toLowerCase().includes('site') ||
      company.toLowerCase().includes('description');

    const contents = `Write a professional, high-impact cover letter for the ${title} position.

CONTEXT:
- Target Company: ${
      isPlaceholder
        ? 'Carefully scan the job description below to identify the actual company name. If not found, use "Hiring Manager".'
        : company
    }
- Candidate: ${name} (${email})
- Job Description: ${description}
- Source Resume: ${resume}

STRICT INSTRUCTIONS:
- NEVER use the phrase "Review Required", "Unknown Company", "Check Site", or "Check Description" in the letter.
- Address the recipient formally.
- Match candidate skills to the requirements in the job description.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction:
          'You are an expert career coach writing professional, ATS-optimized cover letters.',
      },
    });

    const text = response.text || '';
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('[COVER-LETTER] Error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to generate cover letter' });
  }
}
