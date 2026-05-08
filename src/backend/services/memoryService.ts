import { mockMemories } from '@/backend/db/mockMemories'

export const memoryService = {
  getAllMemories: () => mockMemories,

  getMemoryById: (id: string) => {
    return mockMemories.find(memory => memory.id === id)
  },
}
