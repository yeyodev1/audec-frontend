import { defineStore } from 'pinia'
import BrandsService from '@/api/brands.service'

// Update interfaces to match the data structure from BrandsService
interface CarModel {
  id: number | string
  name: string
  slug: string
  imageUrl: string
  year: string | number
  description?: string
  price?: number
}

interface CarBrand {
  id: number | string
  name: string
  slug: string
  imageUrl: string // Changed from logo to match BrandsService
  country: string
  description?: string
  models: CarModel[]
}

interface Category {
  id: string
  name: string
  description: string
}

interface RootState {
  brands: CarBrand[]
  categories: Category[]
  selectedBrand: CarBrand | null
  selectedModel: CarModel | null
  isLoading: boolean
  errorMessage: string | null
}

export const useCarBrandsStore = defineStore('CarBrandsStore', {
  state: (): RootState => ({
    brands: [],
    categories: [],
    selectedBrand: null,
    selectedModel: null,
    isLoading: false,
    errorMessage: null
  }),

  actions: {
    // Fetch all brands from the API
    async fetchAllBrands() {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        const brandsService = new BrandsService()
        const brandsData = await brandsService.getAllBrands()
        
        // Map the API response to match our store structure
        this.brands = brandsData.map((brand: any) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          imageUrl: brand.imageUrl,
          country: brand.country || 'Unknown',
          description: brand.description || '',
          models: brand.models.map((model: any) => ({
            id: model.id,
            name: model.name,
            slug: model.slug,
            imageUrl: model.imageUrl,
            year: model.year || new Date().getFullYear(),
            description: model.description || '',
            // Add a default price since the API doesn't provide one
            price: Math.floor(Math.random() * 50000) + 20000
          }))
        }))
        
        return this.brands
      } catch (error: any) {
        this.errorMessage = error.message || 'Failed to fetch brands'
        console.error('Error fetching brands:', error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    // Get all brands (use fetchAllBrands first)
    getAllBrands() {
      if (this.brands.length === 0) {
        return this.fetchAllBrands()
      }
      return this.brands
    },

    // Get all categories
    getAllCategories() {
      return this.categories
    },

    // Get brand by ID
    async getBrandById(brandId: string | number) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        // Ensure brands are loaded
        if (this.brands.length === 0) {
          await this.fetchAllBrands()
        }
        
        const brand = this.brands.find(b => b.id.toString() === brandId.toString()) || null
        this.selectedBrand = brand
        return brand
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Get brand by slug
    async getBrandBySlug(slug: string) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        // Ensure brands are loaded
        if (this.brands.length === 0) {
          await this.fetchAllBrands()
        }
        
        const brand = this.brands.find(b => b.slug === slug) || null
        this.selectedBrand = brand
        return brand
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Get models by brand ID
    async getModelsByBrandId(brandId: string | number) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        // Ensure brands are loaded
        if (this.brands.length === 0) {
          await this.fetchAllBrands()
        }
        
        const brand = this.brands.find(b => b.id.toString() === brandId.toString())
        return brand ? brand.models : []
      } catch (error: any) {
        this.errorMessage = error.message
        return []
      } finally {
        this.isLoading = false
      }
    },

    // Get model by ID
    async getModelById(brandId: string | number, modelId: string | number) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        // Ensure brands are loaded
        if (this.brands.length === 0) {
          await this.fetchAllBrands()
        }
        
        const brand = this.brands.find(b => b.id.toString() === brandId.toString())
        if (!brand) return null
        
        const model = brand.models.find(m => m.id.toString() === modelId.toString()) || null
        this.selectedModel = model
        return model
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Get model by slug
    async getModelBySlug(brandSlug: string, modelSlug: string) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        // Ensure brands are loaded
        if (this.brands.length === 0) {
          await this.fetchAllBrands()
        }
        
        const brand = this.brands.find(b => b.slug === brandSlug)
        if (!brand) return null
        
        const model = brand.models.find(m => m.slug === modelSlug) || null
        this.selectedModel = model
        return model
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // The following methods are kept for compatibility but should be updated in a real app
    // to use the API service for creating/updating/deleting

    // Add new brand
    addBrand(brand: Omit<CarBrand, 'id'>) {
      this.isLoading = true
      try {
        const newBrand = {
          ...brand,
          id: Date.now().toString() // Generate a simple ID
        }
        this.brands.push(newBrand as CarBrand)
        return newBrand
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Add model to brand
    addModelToBrand(brandId: string | number, model: Omit<CarModel, 'id'>) {
      this.isLoading = true
      try {
        const brand = this.brands.find(b => b.id.toString() === brandId.toString())
        if (!brand) throw new Error('Brand not found')
        
        const newModel = {
          ...model,
          id: Date.now().toString() // Generate a simple ID
        }
        brand.models.push(newModel as CarModel)
        return newModel
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Update brand
    updateBrand(brandId: string | number, updates: Partial<CarBrand>) {
      this.isLoading = true
      try {
        const brandIndex = this.brands.findIndex(b => b.id.toString() === brandId.toString())
        if (brandIndex === -1) throw new Error('Brand not found')
        
        this.brands[brandIndex] = {
          ...this.brands[brandIndex],
          ...updates
        }
        return this.brands[brandIndex]
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Delete brand
    deleteBrand(brandId: string | number) {
      this.isLoading = true
      try {
        const brandIndex = this.brands.findIndex(b => b.id.toString() === brandId.toString())
        if (brandIndex === -1) throw new Error('Brand not found')
        
        this.brands.splice(brandIndex, 1)
        return true
      } catch (error: any) {
        this.errorMessage = error.message
        return false
      } finally {
        this.isLoading = false
      }
    },
    // Add this new action to the store
    async getBrandModels(brandSlug: string) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        const brandsService = new BrandsService()
        const models = await brandsService.getAllModelsByBrand(brandSlug)
        return models
      } catch (error: any) {
        this.errorMessage = error.message || 'Failed to fetch brand models'
        console.error('Error fetching brand models:', error)
        return []
      } finally {
        this.isLoading = false
      }
    }
  }
})

export default useCarBrandsStore
