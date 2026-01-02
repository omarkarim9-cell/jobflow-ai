// api/audio-briefing.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateAudioBriefing } from '../services/geminiService.ts';
import { Job, UserProfile } from '../types.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { job, profile } = req.body as { job: Job; profile: UserProfile };

    if (!job || !profile) {
      return res.status(400).json({ error: 'Missing job or profile payload' });
    }

    const audioBase64 = await generateAudioBriefing(job, profile);
    return res.status(200).json({ audioBase64 });
  } catch (error: any) {
    console.error('Audio briefing error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate audio briefing' });
  }
}
