<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCarBrandsStore } from '@/store/CarBrandsStore';
import { ref, onMounted, computed } from 'vue';

const route = useRoute();
const router = useRouter();
const carBrandsStore = useCarBrandsStore();
const isLoading = ref(true);

const currentBrand = computed(() => {
  const brandId = route.params.brand;
  return carBrandsStore.brands.find(brand => brand.id === brandId) || null;
});

onMounted(async () => {
  try {
    if (carBrandsStore.brands.length === 0) {
      await carBrandsStore.getAllBrands();
    }
    
    if (!currentBrand.value) {
      console.error('Brand not found');
      await router.push('/brands');
    }
  } catch (error) {
    console.error('Error loading brand:', error);
    await router.push('/brands');
  } finally {
    isLoading.value = false;
  }
});

const formatPrice = (price) => {
  return `$${price.toLocaleString()}`;
};

const handleModelSelect = async (modelId) => {
  try {
    const brandId = route.params.brand;
    await router.push(`/brands/${brandId}/${modelId}`);
  } catch (error) {
    console.error('Error navigating to model:', error);
  }
};
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      <p>Cargando información...</p>
    </div>
    
    <div v-else-if="currentBrand" class="brand-details">
      <div class="brand-header">
        <nuxt-link to="/brands" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Volver a marcas
        </nuxt-link>
        
        <div class="brand-info">
          <img :src="currentBrand.logo" :alt="currentBrand.name" class="brand-logo">
          <div>
            <h1 class="brand-name">{{ currentBrand.name }}</h1>
            <p class="brand-country">{{ currentBrand.country }}</p>
          </div>
        </div>
      </div>
      
      <h2 class="models-title">Modelos disponibles</h2>
      
      <div v-if="currentBrand.models.length > 0" class="models-grid">
        <div 
          v-for="model in currentBrand.models" 
          :key="model.id" 
          class="model-card"
          @click="handleModelSelect(model.id)"
        >
          <div class="model-image-container">
            <img :src="model.imageUrl" :alt="model.name" class="model-image">
          </div>
          <div class="model-info">
            <h3 class="model-name">{{ model.name }}</h3>
            <div class="model-details">
              <span class="model-year">{{ model.year }}</span>
              <span class="model-price">{{ formatPrice(model.price) }}</span>
            </div>
            <button class="view-details-btn">Ver detalles</button>
          </div>
        </div>
      </div>
      
      <div v-else class="no-models">
        <p>No hay modelos disponibles para esta marca</p>
      </div>
    </div>
    
    <div v-else class="not-found">
      <h2>Marca no encontrada</h2>
      <p>Lo sentimos, la marca que buscas no existe en nuestro catálogo.</p>
      <nuxt-link to="/brands" class="back-link">Volver a marcas</nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading, .not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: $greyDark;
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
  
  i {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: $red;
  }
}

.brand-header {
  margin-bottom: 3rem;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand-logo {
  max-width: 150px;
  max-height: 100px;
  object-fit: contain;
}

.brand-name {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: $black;
}

.brand-country {
  font-size: 1.2rem;
  color: $greyDark;
}

.models-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: $black;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: $red;
    border-radius: 1.5px;
  }
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.model-card {
  background-color: $white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba($black, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba($black, 0.15);
    
    .model-image {
      transform: scale(1.05);
    }
  }
}

.model-image-container {
  height: 200px;
  overflow: hidden;
}

.model-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.model-info {
  padding: 1.5rem;
}

.model-name {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: $black;
}

.model-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.model-year {
  font-size: 1rem;
  color: $greyDark;
  background-color: #f5f5f5;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.model-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: $red;
}

.view-details-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: $red;
  color: $white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: darken($red, 10%);
  }
}

@media (max-width: 768px) {
  .brand-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .models-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .model-image-container {
    height: 180px;
  }
}
</style>