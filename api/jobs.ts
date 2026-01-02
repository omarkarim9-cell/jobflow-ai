// api/jobs.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Job } from '../types.ts';
import { JobStatus } from '../types.ts';

// Simple in-memory store for all jobs in dev
let jobs: Job[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[JOBS] HANDLER START, NODE_ENV =', process.env.NODE_ENV, 'method:', req.method);

  // Always use dev bypass in v2 – no Clerk at all
  const mockUserId = 'dev_user_123';
  console.log('[JOBS] DEV MODE - using mock user', mockUserId);

  if (req.method === 'GET') {
    // For now, no user filtering – return all jobs
    return res.status(200).json({ jobs });
  }

  if (req.method === 'POST') {
    const job = req.body as Job;

    const newJob: Job = {
      ...job,
      id: job.id || `job-${Date.now()}`,
      status: job.status || JobStatus.DETECTED,
      detectedAt: job.detectedAt || new Date().toISOString(),
    };

    jobs.push(newJob);
    return res.status(201).json({ job: newJob });
  }

  if (req.method === 'PUT') {
    const updatedJob = req.body as Job;
    jobs = jobs.map(j => (j.id === updatedJob.id ? updatedJob : j));
    return res.status(200).json({ job: updatedJob });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing job id' });
    }
    jobs = jobs.filter(j => j.id !== id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
