import { describe, expect, it } from 'vitest'
import { GetHealthHandler } from './GetHealthHandler'
import { GetHealth } from './GetHealth'

describe('GetHealthHandler', () => {
  describe('When invoked', () => {
    it('should return true', () => {
      const command = new GetHealth()
      const handler = new GetHealthHandler()
      const response = handler.handle(command)
      expect(response).toBe(true)
    })
  })
})
