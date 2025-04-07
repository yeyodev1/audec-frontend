<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCarBrandsStore } from '@/store/CarBrandsStore';
import { ref, onMounted, computed, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const carBrandsStore = useCarBrandsStore();
const isLoading = ref(true);
const loadingMessage = ref('Cargando información de marca...');
const brandModels = ref([]);

// Get brand slug from route params
const brandSlug = computed(() => route.params.brand);

// Compute current brand based on the slug
const currentBrand = computed(() => {
  return carBrandsStore.brands.find(brand => brand.slug === brandSlug.value) || null;
});

// Load brand models
const loadBrandModels = async () => {
  try {
    loadingMessage.value = 'Cargando modelos...';
    brandModels.value = await carBrandsStore.getBrandModels(brandSlug.value);
  } catch (error) {
    console.error('Error loading models:', error);
  }
};

onMounted(async () => {
  try {
    loadingMessage.value = 'Cargando información...';
    
    // Fetch brands data
    await carBrandsStore.fetchAllBrands();
    
    // Check if brand exists after loading
    if (!currentBrand.value) {
      console.error('Brand not found:', brandSlug.value);
      await router.push('/brands');
      return;
    }
    
    // Load models for the current brand
    await loadBrandModels();
    
  } catch (error) {
    console.error('Error loading brand:', error);
    loadingMessage.value = 'Error al cargar la información.';
  } finally {
    isLoading.value = false;
  }
});

// Watch for changes in the route to handle navigation between brands
watch(brandSlug, async (newSlug) => {
  if (!newSlug) return;
  
  isLoading.value = true;
  try {
    if (carBrandsStore.brands.length === 0) {
      await carBrandsStore.fetchAllBrands();
    }
    
    if (!currentBrand.value) {
      console.error('Brand not found after navigation:', newSlug);
      await router.push('/brands');
      return;
    }
    
    await loadBrandModels();
  } catch (error) {
    console.error('Error during navigation:', error);
  } finally {
    isLoading.value = false;
  }
});

const formatPrice = (price) => {
  if (!price) return 'Precio a consultar';
  return `$${price.toLocaleString()}`;
};

const handleModelSelect = async (modelSlug) => {
  try {
    await router.push(`/brands/${brandSlug.value}/${modelSlug}`);
  } catch (error) {
    console.error('Error navigating to model:', error);
  }
};
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>
    
    <div v-else-if="currentBrand" class="brand-details">
      <div class="brand-header">
        <nuxt-link to="/brands" class="back-link">
          <i class="fas fa-arrow-left"></i> Volver a marcas
        </nuxt-link>
        
        <div class="brand-info">
          <img :src="currentBrand.imageUrl" :alt="currentBrand.name" class="brand-logo">
          <div class="brand-text">
            <h1>{{ currentBrand.name }}</h1>
            <p>{{ currentBrand.country }}</p>
          </div>
        </div>
      </div>

      <div class="models-section">
        <h2>Modelos disponibles</h2>
        
        <div v-if="currentBrand.models && currentBrand.models.length > 0" class="models-grid">
          <div 
            v-for="(model, index) in currentBrand.models" 
            :key="index" 
            class="model-card"
            @click="handleModelSelect(model.slug)"
          >
            <div class="model-image-wrapper">
              <img :src="model.imageUrl" :alt="model.name">
            </div>
            <div class="model-content">
              <h3>{{ model.name }}</h3>
              <div class="model-info">
                <span class="year">{{ model.year }}</span>
                <span class="price">{{ formatPrice(model.price) }}</span>
              </div>
              <button class="details-btn">Ver detalles</button>
            </div>
          </div>
        </div>
        
        <div v-else class="no-models">
          <p>No hay modelos disponibles para esta marca</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.brand-header {
  margin-bottom: 3rem;
  
  .back-link {
    display: inline-flex;
    align-items: center;
    color: #666;
    text-decoration: none;
    margin-bottom: 2rem;
    
    i {
      margin-right: 0.5rem;
    }
    
    &:hover {
      color: #ff4444;
    }
  }
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  
  .brand-logo {
    width: 120px;
    height: auto;
    object-fit: contain;
  }
  
  .brand-text {
    h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }
    
    p {
      color: #666;
      margin: 0;
    }
  }
}

.models-section {
  h2 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 0.5rem;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: #ff4444;
    }
  }
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.model-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  .model-image-wrapper {
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }
  
  &:hover .model-image-wrapper img {
    transform: scale(1.05);
  }
}

.model-content {
  padding: 1.5rem;
  
  h3 {
    margin: 0 0 1rem;
    font-size: 1.4rem;
    color: #333;
  }
}

.model-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  .year {
    background: #f5f5f5;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #666;
  }
  
  .price {
    font-weight: 600;
    color: #ff4444;
    font-size: 1.2rem;
  }
}

.details-btn {
  width: 100%;
  padding: 0.8rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #ff2222;
  }
}

.loading, .no-models {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .brand-info {
    flex-direction: column;
    text-align: center;
    
    .brand-logo {
      margin-bottom: 1rem;
    }
  }
  
  .models-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>