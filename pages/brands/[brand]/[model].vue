<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCarBrandsStore } from '@/store/CarBrandsStore';
import { ref, onMounted, computed } from 'vue';

const route = useRoute();
const router = useRouter();
const carBrandsStore = useCarBrandsStore();
const isLoading = ref(true);

const brandId = computed(() => route.params.brand);
// Fix the model parameter name to match the route
const modelId = computed(() => route.params.model);

const currentModel = computed(() => {
  return carBrandsStore.getModelById(brandId.value, modelId.value);
});

const currentBrand = computed(() => {
  return carBrandsStore.getBrandById(brandId.value);
});

const formatPrice = (price) => {
  return `$${price.toLocaleString()}`;
};

onMounted(async () => {
  try {
    if (carBrandsStore.brands.length === 0) {
      await carBrandsStore.getAllBrands();
    }

    if (!currentModel.value || !currentBrand.value) {
      console.error('Model or brand not found');
      await router.push(`/brands/${brandId.value}`);
    }
  } catch (error) {
    console.error('Error loading model:', error);
    await router.push(`/brands/${brandId.value}`);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      <p>Cargando información...</p>
    </div>

    <div v-else-if="currentModel && currentBrand" class="model-details">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb">
        <nuxt-link to="/brands" class="breadcrumb-link">Marcas</nuxt-link>
        <i class="fa-solid fa-chevron-right"></i>
        <nuxt-link :to="`/brands/${currentBrand.id}`" class="breadcrumb-link">
          {{ currentBrand.name }}
        </nuxt-link>
        <i class="fa-solid fa-chevron-right"></i>
        <span class="breadcrumb-current">{{ currentModel.name }}</span>
      </div>

      <!-- Main Content -->
      <div class="model-content">
        <div class="model-image-gallery">
          <img :src="currentModel.imageUrl" :alt="currentModel.name" class="model-main-image">
        </div>

        <div class="model-info">
          <div class="model-header">
            <img :src="currentBrand.logo" :alt="currentBrand.name" class="brand-logo">
            <div>
              <h1 class="model-name">{{ currentModel.name }}</h1>
              <p class="model-brand">{{ currentBrand.name }}</p>
            </div>
          </div>

          <div class="model-specs">
            <div class="spec-item">
              <i class="fa-solid fa-calendar"></i>
              <div>
                <h3>Año</h3>
                <p>{{ currentModel.year }}</p>
              </div>
            </div>

            <div class="spec-item">
              <i class="fa-solid fa-tag"></i>
              <div>
                <h3>Precio</h3>
                <p>{{ formatPrice(currentModel.price) }}</p>
              </div>
            </div>

            <div class="spec-item">
              <i class="fa-solid fa-flag"></i>
              <div>
                <h3>País de origen</h3>
                <p>{{ currentBrand.country }}</p>
              </div>
            </div>
          </div>

          <div class="model-actions">
            <button class="action-button action-button--primary">
              <i class="fa-solid fa-phone"></i>
              Contactar vendedor
            </button>
            <button class="action-button action-button--secondary">
              <i class="fa-regular fa-heart"></i>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Modelo no encontrado</h2>
      <p>Lo sentimos, el modelo que buscas no existe en nuestro catálogo.</p>
      <nuxt-link :to="`/brands/${brandId}`" class="back-link">
        Volver a la marca
      </nuxt-link>
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

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  i {
    color: $greyDark;
    font-size: 0.8rem;
  }
}

.breadcrumb-link {
  color: $greyDark;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: $red;
  }
}

.breadcrumb-current {
  color: $black;
  font-weight: 600;
}

.model-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.model-image-gallery {
  position: sticky;
  top: 2rem;
}

.model-main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba($black, 0.1);
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  .brand-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
}

.model-name {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: $black;
}

.model-brand {
  font-size: 1.2rem;
  color: $greyDark;
}

.model-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  i {
    font-size: 1.5rem;
    color: $red;
  }
  
  h3 {
    font-size: 0.9rem;
    color: $greyDark;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 1.1rem;
    font-weight: 600;
    color: $black;
  }
}

.model-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  flex: 1;
  padding: 1rem;
  border-radius: 5px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  i {
    font-size: 1.1rem;
  }
  
  &--primary {
    background-color: $red;
    color: $white;
    
    &:hover {
      background-color: darken($red, 10%);
    }
  }
  
  &--secondary {
    background-color: $white;
    color: $black;
    border: 2px solid $greyDark;
    
    &:hover {
      background-color: $greyDark;
      color: $white;
    }
  }
}

@media (max-width: 968px) {
  .model-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .model-image-gallery {
    position: static;
  }
  
  .model-main-image {
    height: 300px;
  }
  
  .model-specs {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .model-header {
    flex-direction: column;
    text-align: center;
    
    .brand-logo {
      width: 50px;
      height: 50px;
    }
  }
  
  .model-name {
    font-size: 2rem;
  }
  
  .model-actions {
    flex-direction: column;
  }
}
</style>