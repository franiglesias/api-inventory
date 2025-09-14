import { describe, expect, it } from 'vitest'
import { StoredProduct } from '../../../inventory/driven/forStoringProducts/ForStoringProducts'
import { ForStoringProductsMemoryAdapter } from './MemoryAdapter'

describe('ForStoringProductsMemoryAdapter', () => {
  describe('When storing a product with new id', () => {
    it('should add a new entry', () => {
      const product = new StoredProduct()
      product.id = 'e5057e6d-cdc0-490e-857e-6dcdc0b90e08'
      product.sku = 'SKU'
      product.name = 'Name'
      product.description = 'Description'
      product.stock = 10
      product.minStock = 5
      product.createdAt = new Date()
      product.updatedAt = new Date()
      const forStoringProducts = new ForStoringProductsMemoryAdapter([])
      forStoringProducts.store(product)

      expect(forStoringProducts.retrieveAll()).toHaveLength(1)
    })
  })

  describe('When storing a product with existing id', () => {
    it('should update the entry', () => {
      const product = new StoredProduct()
      product.id = 'e5057e6d-cdc0-490e-857e-6dcdc0b90e08'
      product.sku = 'SKU'
      product.name = 'Product Name'
      product.description = 'First version of the product'
      product.stock = 10
      product.minStock = 5
      product.createdAt = new Date()
      product.updatedAt = new Date()

      const forStoringProducts = new ForStoringProductsMemoryAdapter([])
      forStoringProducts.store(product)

      product.name = 'Product Name Updated'
      product.description = 'Second version of the product'

      forStoringProducts.store(product)

      expect(forStoringProducts.retrieveAll()).toHaveLength(1)
    })
  })
})
