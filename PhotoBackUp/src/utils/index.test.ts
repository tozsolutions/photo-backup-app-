import { describe, it, expect } from 'vitest'
import { formatFileSize, getRelativeTime, getCategoryDisplayName } from '../utils'

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })
})

describe('getRelativeTime', () => {
  it('returns "Şimdi" for very recent dates', () => {
    const now = new Date()
    expect(getRelativeTime(now)).toBe('Şimdi')
  })

  it('returns minutes for recent dates', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(getRelativeTime(fiveMinutesAgo)).toBe('5 dakika önce')
  })
})

describe('getCategoryDisplayName', () => {
  it('returns correct Turkish names for categories', () => {
    expect(getCategoryDisplayName('camera')).toBe('Kamera Fotoğrafları')
    expect(getCategoryDisplayName('downloads')).toBe('Alınan Dosyalar')
    expect(getCategoryDisplayName('sent')).toBe('Gönderilen Dosyalar')
    expect(getCategoryDisplayName('deleted')).toBe('Silinmiş Öğeler')
    expect(getCategoryDisplayName('unknown')).toBe('Bilinmeyen')
  })
})