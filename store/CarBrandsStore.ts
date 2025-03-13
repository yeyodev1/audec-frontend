import { defineStore } from 'pinia'

interface CarModel {
  id: string
  name: string
  year: number
  price: number
  imageUrl: string
}

interface CarBrand {
  id: string
  name: string
  logo: string
  country: string
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
    brands: [
      {
        id: '1',
        name: 'Toyota',
        logo: 'https://www.carlogos.org/car-logos/toyota-logo-2019-1350x1500.png',
        country: 'Japan',
        models: [
          { 
            id: '101', 
            name: 'Corolla', 
            year: 2023, 
            price: 25000,
            imageUrl: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=1974&auto=format&fit=crop' 
          },
          { 
            id: '102', 
            name: 'Camry', 
            year: 2023, 
            price: 30000,
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1974&auto=format&fit=crop' 
          },
          { 
            id: '103', 
            name: 'RAV4', 
            year: 2023, 
            price: 32000,
            imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=1974&auto=format&fit=crop' 
          }
        ]
      },
      {
        id: '2',
        name: 'Honda',
        logo: 'https://www.carlogos.org/car-logos/honda-logo-2000-1920x1080.png',
        country: 'Japan',
        models: [
          { 
            id: '201', 
            name: 'Civic', 
            year: 2023, 
            price: 26000,
            imageUrl: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1974&auto=format&fit=crop' 
          },
          { 
            id: '202', 
            name: 'Accord', 
            year: 2023, 
            price: 31000,
            imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=1974&auto=format&fit=crop' 
          },
          { 
            id: '203', 
            name: 'CR-V', 
            year: 2023, 
            price: 33000,
            imageUrl: 'https://images.unsplash.com/photo-1568844293986-ca3c5a880aa2?q=80&w=1974&auto=format&fit=crop' 
          }
        ]
      },
      {
        id: '3',
        name: 'Ford',
        logo: 'https://www.carlogos.org/car-logos/ford-logo-2017-1500x1101.png',
        country: 'USA',
        models: [
          { 
            id: '301', 
            name: 'Mustang', 
            year: 2023, 
            price: 40000,
            imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1470&auto=format&fit=crop' 
          },
          { 
            id: '302', 
            name: 'F-150', 
            year: 2023, 
            price: 45000,
            imageUrl: 'https://images.unsplash.com/photo-1581652177699-96676ee5f8a7?q=80&w=1470&auto=format&fit=crop' 
          },
          { 
            id: '303', 
            name: 'Explorer', 
            year: 2023, 
            price: 38000,
            imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop' 
          }
        ]
      },
      {
        id: '4',
        name: 'BMW',
        logo: 'https://www.carlogos.org/car-logos/bmw-logo-2020-gray-1500x1500.png',
        country: 'Germany',
        models: [
          { 
            id: '401', 
            name: 'Series 3', 
            year: 2023, 
            price: 50000,
            imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=1470&auto=format&fit=crop' 
          },
          { 
            id: '402', 
            name: 'Series 5', 
            year: 2023, 
            price: 65000,
            imageUrl: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=1470&auto=format&fit=crop' 
          },
          { 
            id: '403', 
            name: 'X5', 
            year: 2023, 
            price: 70000,
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1470&auto=format&fit=crop' 
          }
        ]
      }
    ],
    categories: [
      { id: '1', name: 'Sedan', description: 'Four-door passenger car with a separate trunk' },
      { id: '2', name: 'SUV', description: 'Sport Utility Vehicle with higher ground clearance' },
      { id: '3', name: 'Truck', description: 'Vehicle with an open cargo area' },
      { id: '4', name: 'Sports Car', description: 'High-performance vehicle designed for speed' },
      { id: '5', name: 'Electric', description: 'Vehicles powered by electricity' }
    ],
    selectedBrand: null,
    selectedModel: null,
    isLoading: false,
    errorMessage: null
  }),

  actions: {
    // Get all brands
    getAllBrands() {
      this.isLoading = true
      try {
        return this.brands
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Get all categories
    getAllCategories() {
      this.isLoading = true
      try {
        return this.categories
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Get brand by ID
    getBrandById(brandId: string) {
      this.isLoading = true
      try {
        const brand = this.brands.find(b => b.id === brandId) || null
        this.selectedBrand = brand
        return brand
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Get models by brand ID
    getModelsByBrandId(brandId: string) {
      this.isLoading = true
      try {
        const brand = this.brands.find(b => b.id === brandId)
        return brand ? brand.models : []
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Get model by ID
    getModelById(brandId: string, modelId: string) {
      this.isLoading = true
      try {
        const brand = this.brands.find(b => b.id === brandId)
        if (!brand) return null
        
        const model = brand.models.find(m => m.id === modelId) || null
        this.selectedModel = model
        return model
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

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
      } finally {
        this.isLoading = false
      }
    },

    // Add model to brand
    addModelToBrand(brandId: string, model: Omit<CarModel, 'id'>) {
      this.isLoading = true
      try {
        const brand = this.brands.find(b => b.id === brandId)
        if (!brand) throw new Error('Brand not found')
        
        const newModel = {
          ...model,
          id: Date.now().toString() // Generate a simple ID
        }
        brand.models.push(newModel as CarModel)
        return newModel
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Update brand
    updateBrand(brandId: string, updates: Partial<CarBrand>) {
      this.isLoading = true
      try {
        const brandIndex = this.brands.findIndex(b => b.id === brandId)
        if (brandIndex === -1) throw new Error('Brand not found')
        
        this.brands[brandIndex] = {
          ...this.brands[brandIndex],
          ...updates
        }
        return this.brands[brandIndex]
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    // Delete brand
    deleteBrand(brandId: string) {
      this.isLoading = true
      try {
        const brandIndex = this.brands.findIndex(b => b.id === brandId)
        if (brandIndex === -1) throw new Error('Brand not found')
        
        this.brands.splice(brandIndex, 1)
        return true
      } catch (error: any) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})

export default useCarBrandsStore