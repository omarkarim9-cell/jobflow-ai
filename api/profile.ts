// api/profile.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { UserProfile } from '../types.ts';
import { neon } from '@neondatabase/serverless';

const MOCK_USER_ID = 'dev_user_123';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[PROFILE] HANDLER START, NODE_ENV =', process.env.NODE_ENV, 'method:', req.method);

  if (!process.env.DATABASE_URL) {
    console.error('[PROFILE] Missing DATABASE_URL');
    return res.status(500).json({ error: 'Server DB config error' });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    if (req.method === 'GET') {
      const rows = await sql<any[]>`
        SELECT
          id,
          full_name,
          email,
          phone,
          resume_content,
          resume_file_name,
          preferences,
          connected_accounts,
          plan,
          daily_ai_credits,
          total_ai_used,
          updated_at
        FROM profiles
        WHERE id = ${MOCK_USER_ID}
        LIMIT 1
      `;

      const row = rows[0] || null;

      if (!row) {
        // No profile yet for this user
        return res.status(200).json(null);
      }

      // Map DB row -> UserProfile shape expected by frontend
      const profile: UserProfile = {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        resume: row.resume_content, // map to whatever field your UI uses
        resumeFileName: row.resume_file_name,
        preferences: row.preferences,
        connected_accounts: row.connected_accounts,
        plan: row.plan,
        daily_ai_credits: row.daily_ai_credits,
        total_ai_used: row.total_ai_used,
        updatedAt: row.updated_at,
      };

      return res.status(200).json(profile);
    }

    if (req.method === 'POST') {
      const profile = req.body as UserProfile;
      const id = MOCK_USER_ID;

      const rows = await sql<any[]>`
        INSERT INTO profiles (
          id,
          full_name,
          email,
          phone,
          resume_content,
          resume_file_name,
          preferences,
          connected_accounts,
          plan,
          daily_ai_credits,
          total_ai_used,
          updated_at
        )
        VALUES (
          ${id},
          ${profile.fullName},
          ${profile.email},
          ${profile.phone},
          ${profile.resume},
          ${profile.resumeFileName},
          ${profile.preferences as any},
          ${profile.connected_accounts as any},
          ${profile.plan},
          ${profile.daily_ai_credits},
          ${profile.total_ai_used},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE
        SET
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          resume_content = EXCLUDED.resume_content,
          resume_file_name = EXCLUDED.resume_file_name,
          preferences = EXCLUDED.preferences,
          connected_accounts = EXCLUDED.connected_accounts,
          plan = EXCLUDED.plan,
          daily_ai_credits = EXCLUDED.daily_ai_credits,
          total_ai_used = EXCLUDED.total_ai_used,
          updated_at = NOW()
        RETURNING
          id,
          full_name,
          email,
          phone,
          resume_content,
          resume_file_name,
          preferences,
          connected_accounts,
          plan,
          daily_ai_credits,
          total_ai_used,
          updated_at
      `;

      const row = rows[0];

      const saved: UserProfile = {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        resume: row.resume_content,
        resumeFileName: row.resume_file_name,
        preferences: row.preferences,
        connected_accounts: row.connected_accounts,
        plan: row.plan,
        daily_ai_credits: row.daily_ai_credits,
        total_ai_used: row.total_ai_used,
        updatedAt: row.updated_at,
      };

      return res.status(200).json(saved);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[PROFILE] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
