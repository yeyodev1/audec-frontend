<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCarBrandsStore } from '@/store/CarBrandsStore';
import { ref, onMounted, computed } from 'vue';

const route = useRoute();
const router = useRouter();
const carBrandsStore = useCarBrandsStore();
const isLoading = ref(true);
const loadingMessage = ref('Cargando información del modelo...');

// Get brand and model slugs from route params
const brandSlug = computed(() => route.params.brand);
const modelSlug = computed(() => route.params.model);

// Store the current model and brand
const currentModel = ref(null);
const currentBrand = ref(null);

// Gallery state
const currentImageIndex = ref(0);
const galleryImages = ref([]);


// Gallery navigation methods
const nextImage = () => {
  if (currentImageIndex.value < galleryImages.value.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0; // Loop back to first image
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = galleryImages.value.length - 1; // Loop to last image
  }
};

const selectImage = (index) => {
  currentImageIndex.value = index;
};

onMounted(async () => {
  try {
    loadingMessage.value = 'Cargando información...';
    
    // Ensure brands are loaded
    if (carBrandsStore.brands.length === 0) {
      await carBrandsStore.fetchAllBrands();
    }
    
    // Get the brand by slug
    currentBrand.value = carBrandsStore.brands.find(brand => brand.slug === brandSlug.value);
    
    if (!currentBrand.value) {
      console.error('Brand not found:', brandSlug.value);
      await router.push('/brands');
      return;
    }
    
    // Get the model by slug
    currentModel.value = currentBrand.value.models.find(model => model.slug === modelSlug.value);

    if (!currentModel.value) {
      console.error('Model not found:', modelSlug.value);
      await router.push(`/brands/${brandSlug.value}`);
      return;
    }
    
    // Setup gallery images
    if (currentModel.value.images && currentModel.value.images.length > 0) {
      // Use the images array directly from the model
      galleryImages.value = currentModel.value.images;
    } else if (currentModel.value.imageUrl) {
      // If no images array but has imageUrl, create a single image array
      galleryImages.value = [
        { url: currentModel.value.imageUrl, alt: currentModel.value.name }
      ];
    }
    
  } catch (error) {
    console.error('Error loading model details:', error);
    loadingMessage.value = 'Error al cargar la información del modelo.';
  } finally {
    isLoading.value = false;
  }
});

// Function to format WhatsApp message
const getWhatsAppLink = () => {
  // Phone number (replace with your actual dealer number)
  const phoneNumber = '593978735794'; // Format: country code + number without + or spaces
  
  // Create message with car details
  const message = encodeURIComponent(
    `Hola, estoy interesado en el auto ${currentModel.value.name} ${currentModel.value.year} de ${currentBrand.value.name}. ¿Podrían proporcionarme más información?`
  );
  
  // Return WhatsApp URL
  return `https://wa.me/${phoneNumber}?text=${message}`;
};
</script>

<template>
  <div class="container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <div v-else-if="currentModel && currentBrand" class="model-details">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb">
        <nuxt-link to="/brands" class="breadcrumb-link">Marcas</nuxt-link>
        <i class="fas fa-chevron-right"></i>
        <nuxt-link :to="`/brands/${brandSlug}`" class="breadcrumb-link">
          {{ currentBrand.name }}
        </nuxt-link>
        <i class="fas fa-chevron-right"></i>
        <span class="breadcrumb-current">{{ currentModel.name }}</span>
      </div>

      <!-- Main Content -->
      <div class="model-content">
        <!-- Gallery Section -->
        <div class="model-image-gallery">
          <div class="gallery-main">
            <button class="gallery-nav gallery-nav--prev" @click="prevImage" v-if="galleryImages.length > 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <div class="gallery-main-image">
              <img 
                :src="galleryImages[currentImageIndex]?.url || currentModel.imageUrl" 
                :alt="galleryImages[currentImageIndex]?.alt || currentModel.name" 
                class="model-main-image"
              >
            </div>
            
            <button class="gallery-nav gallery-nav--next" @click="nextImage" v-if="galleryImages.length > 1">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <!-- Thumbnails -->
          <div class="gallery-thumbnails" v-if="galleryImages.length > 1">
            <div 
              v-for="(image, index) in galleryImages" 
              :key="index"
              class="gallery-thumbnail"
              :class="{ 'active': currentImageIndex === index }"
              @click="selectImage(index)"
            >
              <img :src="image.url" :alt="image.alt">
            </div>
          </div>
          
          <!-- Image counter -->
          <div class="gallery-counter">
            <span v-if="galleryImages.length > 1">
              Foto {{ currentImageIndex + 1 }} de {{ galleryImages.length }}
            </span>
            <span v-else>
              {{ galleryImages.length }} foto disponible
            </span>
          </div>
        </div>

        <div class="model-info">
          <div class="model-header">
            <img :src="currentBrand.imageUrl" :alt="currentBrand.name" class="brand-logo">
            <div>
              <h1 class="model-name">{{ currentModel.name }}</h1>
              <p class="model-brand">{{ currentBrand.name }}</p>
            </div>
          </div>

          <div class="model-specs">
            <div class="spec-item">
              <i class="fas fa-calendar"></i>
              <div>
                <h3>Año</h3>
                <p>{{ currentModel.year }}</p>
              </div>
            </div>

            <div class="spec-item">
              <i class="fas fa-flag"></i>
              <div>
                <h3>País de origen</h3>
                <p>{{ currentBrand.country }}</p>
              </div>
            </div>
          </div>

          <div class="model-description" v-if="currentModel.description">
            <h3>Descripción</h3>
            <p>{{ currentModel.description }}</p>
          </div>

          <div class="model-actions">
            <a :href="getWhatsAppLink()" target="_blank" class="action-button action-button--primary">
              <i class="fab fa-whatsapp"></i>
              Contactar vendedor
            </a>
            <button class="action-button action-button--secondary">
              <i class="far fa-heart"></i>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Modelo no encontrado</h2>
      <p>Lo sentimos, el modelo que buscas no existe en nuestro catálogo.</p>
      <nuxt-link :to="`/brands/${brandSlug}`" class="back-link">
        Volver a la marca
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  
  .loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #ff4444;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
    color: #666;
  }
  
  .back-link {
    display: inline-flex;
    align-items: center;
    color: #ff4444;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  i {
    color: #666;
    font-size: 0.8rem;
  }
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #ff4444;
  }
}

.breadcrumb-current {
  color: #333;
  font-weight: 600;
}

.model-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.model-image-gallery {
  position: sticky;
  top: 2rem;
}

.gallery-main {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.gallery-main-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  background-color: #f8f8f8;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  i {
    color: #333;
    font-size: 1rem;
  }
  
  &--prev {
    left: 10px;
  }
  
  &--next {
    right: 10px;
  }
}

.gallery-thumbnails {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
}

.gallery-thumbnail {
  flex: 0 0 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    opacity: 0.9;
  }
  
  &.active {
    opacity: 1;
    border-color: #ff4444;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.gallery-counter {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.model-main-image {
  width: 100%;
  border-radius: 12px;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  .brand-logo {
    width: 80px;
    height: auto;
    object-fit: contain;
  }
  
  .model-name {
    font-size: 2.2rem;
    margin: 0 0 0.5rem;
  }
  
  .model-brand {
    color: #666;
    margin: 0;
  }
}

.model-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  .spec-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    
    i {
      font-size: 1.5rem;
      color: #ff4444;
      margin-top: 0.2rem;
    }
    
    h3 {
      font-size: 0.9rem;
      color: #666;
      margin: 0 0 0.3rem;
    }
    
    p {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.model-description {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  p {
    line-height: 1.6;
    color: #444;
  }
}

.model-actions {
  display: flex;
  gap: 1rem;
  
  .action-button {
    flex: 1;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none; /* Add this for the anchor tag */
    
    i {
      font-size: 1.1rem;
    }
    
    &--primary {
      background: #ff4444;
      color: white;
      
      &:hover {
        background: #ff2222;
      }
    }
    
    &--secondary {
      background: #f5f5f5;
      color: #333;
      
      &:hover {
        background: #e5e5e5;
      }
    }
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
}
</style>