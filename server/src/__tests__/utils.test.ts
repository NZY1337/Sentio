import { describe, it, expect, vi } from 'vitest'

describe('utils: constants, calculations, and storage helpers', () => {
  it('constants: MODEL_NAME, BACKGROUND_MODE and maps exist', async () => {
    const { MODEL_NAME, BACKGROUND_MODE, sizeMap, qualityMap, MAX_FILE_SIZE } = await import('../utils/constants')
    expect(MODEL_NAME).toBeDefined()
    expect(BACKGROUND_MODE).toBeDefined()
    expect(typeof sizeMap).toBe('object')
    expect(typeof qualityMap).toBe('object')
    expect(typeof MAX_FILE_SIZE).toBe('number')
  })

  it('calculateImageGenerationCost returns sensible numbers', async () => {
    const { calculateImageGenerationCost } = await import('../utils/constCalculation')

    const imgResponseData = {
      model: 'gpt-image-1',
      quality: 'low',
      size: '1024x1024',
      input_tokens_details: { image_tokens: 0, text_tokens: 100 },
      output_tokens: 10,
    }

    const result = calculateImageGenerationCost(imgResponseData, false)

    // Based on constants in file: imageCost for gpt-image-1 low 1024x1024 is 0.011
    expect(result.imageCost).toBeCloseTo(0.011, 6)
    // Token cost calculation uses tiny per-token prices; check it's > 0
    expect(result.tokenCost).toBeGreaterThan(0)
    expect(result.totalCost).toBeCloseTo(result.tokenCost + result.imageCost, 6)
  })

  it('hasValidImageData and isValidUsage behave correctly', async () => {
    // mock openai to avoid top-level issues when importing index (openaiToFile tested below separately)
    vi.resetModules()
    vi.doMock('openai', () => ({ toFile: vi.fn() }))

    const { hasValidImageData, isValidUsage } = await import('../utils')

    expect(hasValidImageData(undefined)).toBe(false)
    expect(hasValidImageData([{ b64_json: 'abc' }])).toBe(true)

    const goodUsage = {
      input_tokens: 1,
      output_tokens: 2,
      total_tokens: 3,
      input_tokens_details: { image_tokens: 0, text_tokens: 1 },
    }
    expect(isValidUsage(goodUsage)).toBe(true)

    const badUsage = { input_tokens: undefined }
    expect(isValidUsage(badUsage as any)).toBe(false)
  })

  it('openaiToFile calls toFile for each multer file', async () => {
    vi.resetModules()

    const toFileMock = vi.fn().mockImplementation((buffer, name, opts) => ({ name, type: opts?.type }))
    vi.doMock('openai', () => ({ toFile: toFileMock }))

    const { openaiToFile } = await import('../utils')

    const fakeFile: any = {
      buffer: Buffer.from('abc'),
      originalname: 'img.png',
      mimetype: 'image/png',
    }

    const result = await openaiToFile([fakeFile])
    expect(toFileMock).toHaveBeenCalled()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toHaveProperty('name', 'img.png')
  })

  it('storage helpers: createStoragePath and sanitizeFilename', async () => {
    const { createStoragePath, sanitizeFilename } = await import('../utils/uploadToSupabaseStorage')

    const path = createStoragePath('user123', 'generated-0')
    expect(path).toContain('user123')
    expect(path).toContain('generated-0')

    const s = sanitizeFilename('My File (1).PNG')
    expect(s).toBe(s.toLowerCase())
    expect(s).not.toContain(' ')
    const { isGeneratedStoragePath, isUploadedStoragePath } = await import('../utils/uploadToSupabaseStorage')
    const gen = createStoragePath('user123', 'generated-0')
    const up = createStoragePath('user123', 'uploaded-0-file')
    expect(isGeneratedStoragePath(gen)).toBe(true)
    expect(isUploadedStoragePath(up)).toBe(true)
  })

  it('uploadGeneratedImagesToSupabase and uploadUploadedImagesToSupabase call supabase storage', async () => {
    vi.resetModules()

    const uploadMock = vi.fn().mockResolvedValue({ error: null })
    const fromMock = vi.fn(() => ({ upload: uploadMock }))
    const storageMock = { from: fromMock }

    vi.doMock('../services/supabase', () => ({ supabaseClient: { storage: storageMock } }))
    vi.doMock('../../secrets', () => ({ SUPABASE_URL: 'https://supabase.example.com' }))

    const { uploadGeneratedImagesToSupabase, uploadUploadedImagesToSupabase } = await import('../utils/uploadToSupabaseStorage')

    const userId = 'user123'
    const b64 = Buffer.from('test').toString('base64')
  
    const generated = await uploadGeneratedImagesToSupabase(userId, [{ b64_json: b64 }])
    expect(generated.length).toBe(1)
    expect(generated[0]).toContain('https://supabase.example.com')
    expect(uploadMock).toHaveBeenCalled()

    const multerFile: any = {
      buffer: Buffer.from('abc'),
      originalname: 'photo.JPG',
      mimetype: 'image/jpeg',
      size: 1024,
    }

    const uploaded = await uploadUploadedImagesToSupabase(userId, [multerFile])
    expect(uploaded.length).toBe(1)
    expect(uploaded[0]).toContain('https://supabase.example.com')
    expect(uploadMock).toHaveBeenCalled()
  })
})
