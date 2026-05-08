import type { NextApiRequest, NextApiResponse } from 'next'

import { memoryService } from '@/backend/services/memoryService'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(memoryService.getAllMemories())
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
