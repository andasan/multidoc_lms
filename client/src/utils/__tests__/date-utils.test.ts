import { describe, it, expect } from 'vitest'
import { formatDate, parseDateString } from '../date-utils'

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = new Date('2024-03-15T14:00:00.000Z')
      expect(formatDate(date)).toBe('March 15, 2024')
    })

    it('should handle undefined date', () => {
      expect(formatDate(undefined)).toBe('N/A')
    })

    it('should respect locale options', () => {
      const date = new Date('2024-03-15T12:00:00.000Z')
      expect(formatDate(date, { locale: 'fr-FR', month: 'long' }))
        .toBe('15 mars 2024')
    })
  })

  describe('parseDateString', () => {
    it('should parse DD/MM/YYYY format correctly', () => {
      const result = parseDateString('15/03/2024')
      expect(result?.getFullYear()).toBe(2024)
      expect(result?.getMonth()).toBe(2) // 0-based month
      expect(result?.getDate()).toBe(15)
    })

    it('should handle invalid date string', () => {
      expect(parseDateString('invalid')).toBeNull()
    })

    it('should handle undefined input', () => {
      expect(parseDateString(undefined)).toBeNull()
    })
  })

  describe('formatDate with locales', () => {
    const testDate = new Date('2024-03-15T12:00:00.000Z')
    
    it('should format date in French', () => {
      expect(formatDate(testDate, { 
        locale: 'fr-FR',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })).toBe('15 mars 2024')
    })

    it('should format date in English', () => {
      expect(formatDate(testDate, { 
        locale: 'en-US',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })).toBe('March 15, 2024')
    })

    it('should format date in Spanish', () => {
      expect(formatDate(testDate, { 
        locale: 'es-ES',
        month: 'long',
        day: 'numeric', 
        year: 'numeric'
      })).toBe('15 de marzo de 2024')
    })
  })
})