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
  <!-- Update the models section to use brandModels -->
  <div v-if="currentBrand.models && currentBrand.models.length > 0" class="models-grid">
    <div 
      v-for="(model, index) in currentBrand.models" 
      :key="index" 
      class="model-card"
      @click="handleModelSelect(model.slug)"
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
</template>