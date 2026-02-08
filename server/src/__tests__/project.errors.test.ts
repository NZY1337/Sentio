import { describe, it, expect, vi, beforeEach } from 'vitest'

import { designGenerator, designEditor } from '../controllers/project'
import { ProjectValidator } from '../validation/project'
import { openaiService } from '../services/openai/openai'
import * as utils from '../utils'

describe('project controller - error paths', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('designGenerator throws when validation fails', async () => {
    vi.spyOn(ProjectValidator, 'safeParse').mockReturnValue({ success: false, error: { errors: [] } } as any)

    const req: any = { auth: { userId: 'u1' }, body: {} }
    const res: any = {}

    await expect(designGenerator(req, res)).rejects.toBeTruthy()
  })

  it('designGenerator throws when openai returns no data', async () => {
    vi.spyOn(ProjectValidator, 'safeParse').mockReturnValue({ success: true, data: { n:1, prompt: 'x', size: 'AUTO', outputFormat: 'png', quality: 'LOW', category: 'c', spaceType: 's', designTheme: 't' } } as any)
    vi.spyOn(openaiService, 'generate').mockResolvedValue({ data: undefined } as any)

    const req: any = { auth: { userId: 'u1' }, body: {} }
    const res: any = {}

    await expect(designGenerator(req, res)).rejects.toBeTruthy()
  })

  it('designGenerator throws when usage invalid', async () => {
    vi.spyOn(ProjectValidator, 'safeParse').mockReturnValue({ success: true, data: { n:1, prompt: 'x', size: 'AUTO', outputFormat: 'png', quality: 'LOW', category: 'c', spaceType: 's', designTheme: 't' } } as any)
    vi.spyOn(openaiService, 'generate').mockResolvedValue({ data: [{ b64_json: 'a' }], usage: undefined } as any)
    vi.spyOn(utils, 'isValidUsage').mockReturnValue(false as any)

    const req: any = { auth: { userId: 'u1' }, body: {} }
    const res: any = {}

    await expect(designGenerator(req, res)).rejects.toBeTruthy()
  })

  it('designGenerator throws when uploadGeneratedImagesToSupabase fails', async () => {
    vi.spyOn(ProjectValidator, 'safeParse').mockReturnValue({ success: true, data: { n:1, prompt: 'x', size: 'AUTO', outputFormat: 'png', quality: 'LOW', category: 'c', spaceType: 's', designTheme: 't' } } as any)
    vi.spyOn(openaiService, 'generate').mockResolvedValue({ data: [{ b64_json: 'a' }], usage: { input_tokens:1, output_tokens:1, total_tokens:2, input_tokens_details: { image_tokens:0, text_tokens:1 } } } as any)
    vi.spyOn(utils, 'isValidUsage').mockReturnValue(true as any)
    vi.spyOn(utils, 'uploadGeneratedImagesToSupabase').mockRejectedValue(new Error('supabase upload failed'))
    vi.spyOn(utils, 'calculateImageGenerationCost').mockReturnValue({ tokenCost: 0, imageCost: 0, totalCost: 0 } as any)

    const req: any = { auth: { userId: 'u1' }, body: {} }
    const res: any = {}

    await expect(designGenerator(req, res)).rejects.toBeTruthy()
  })

  it('designEditor throws when files missing', async () => {
    vi.spyOn(ProjectValidator, 'safeParse').mockReturnValue({ success: true, data: { n:1, prompt: 'x', size: 'AUTO', outputFormat: 'png', quality: 'LOW', category: 'c', spaceType: 's', designTheme: 't' } } as any)

    const req: any = { auth: { userId: 'u1' }, body: {}, files: undefined }
    const res: any = {}

    await expect(designEditor(req, res)).rejects.toBeTruthy()
  })
})
