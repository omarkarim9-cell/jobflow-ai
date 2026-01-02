// api/tailor-resume.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[TAILOR-RESUME] HANDLER START, NODE_ENV =', process.env.NODE_ENV, 'method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, company, description, resume, email } = req.body as {
      title: string;
      company: string;
      description: string;
      resume: string;
      email: string;
    };

    if (!title || !description || !resume || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isPlaceholder =
      !company ||
      company.toLowerCase().includes('review') ||
      company.toLowerCase().includes('unknown');

    const contents = `Tailor this resume for a ${title} role at ${
      isPlaceholder ? 'the target company' : company
    }.

Email: ${email}.

Original Resume: ${resume}

Job Description: ${description}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction:
          'You are a professional resume writer specializing in ATS optimization. Rewrite bullet points to emphasize relevant experience for the specific role.',
      },
    });

    const text = response.text || '';
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('[TAILOR-RESUME] Error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Failed to tailor resume' });
  }
}
