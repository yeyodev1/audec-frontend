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
  // Add images array for gallery
  images?: Array<{
    url: string
    alt: string
  }>
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
          models: brand.models.map((model: any) => {
            // Use the images array directly if it exists
            let images = model.images || [];
            
            // If no images array but has imageUrl, create a single image array
            if (images.length === 0 && model.imageUrl) {
              images = [{
                url: model.imageUrl,
                alt: `${model.name} main image`
              }];
            }
            
            return {
              id: model.id,
              name: model.name || model.modelName,
              slug: model.slug,
              imageUrl: model.imageUrl || '',
              year: model.year || new Date().getFullYear(),
              description: model.description || '',
              price: Math.floor(Math.random() * 50000) + 20000,
              images: images
            };
          })
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
        
        // If we found the model, set it as selected
        if (model) {
          this.selectedBrand = brand
          this.selectedModel = model
        }
        
        return model
      } catch (error: any) {
        this.errorMessage = error.message
        return null
      } finally {
        this.isLoading = false
      }
    },

    // Get model images
    getModelImages(brandSlug: string, modelSlug: string) {
      try {
        const brand = this.brands.find(b => b.slug === brandSlug)
        if (!brand) return []
        
        const model = brand.models.find(m => m.slug === modelSlug)
        if (!model) return []
        
        // Return the images array if it exists
        if (model.images && model.images.length > 0) {
          return model.images
        }
        
        // Otherwise return an array with just the main image
        return [{
          url: model.imageUrl,
          alt: model.name
        }]
      } catch (error) {
        console.error('Error getting model images:', error)
        return []
      }
    }
  }
})

export default useCarBrandsStore
