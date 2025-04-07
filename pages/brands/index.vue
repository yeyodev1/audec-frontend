<script setup>
import { useCarBrandsStore } from '@/store/CarBrandsStore';
import { ref, onMounted } from 'vue';
import BrandsService from '@/api/brands.service';

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();


const carBrandsStore = useCarBrandsStore();
const brands = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {

    brands.value = carBrandsStore.getAllBrands();
  } catch (error) {
    console.error('Error loading brands:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container">
    <h2 class="brands-title">Nuestras Marcas</h2>
    
    <div v-if="isLoading" class="loading">
      <p>Cargando marcas...</p>
    </div>
    
    <div v-else class="brands-grid">
      <div v-for="brand in brands" :key="brand.id" class="brand-card">
        <div class="brand-card__logo">
          <img :src="brand.imageUrl" :alt="brand.name" class="brand-logo">
        </div>
        <div class="brand-card__info">
          <h3 class="brand-name">{{ brand.name }}</h3>
          <p class="brand-country">{{ brand.country }}</p>
          <p class="brand-models">{{ brand.models.length }} modelos</p>
        </div>
        <nuxt-link :to="`/brands/${brand.name}`" class="brand-link">
          Ver modelos
          <i class="fa-solid fa-arrow-right"></i>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.brands-title {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: $black;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: $red;
    border-radius: 2px;
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: $greyDark;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.brand-card {
  background-color: $white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba($black, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba($black, 0.15);
  }
  
  &__logo {
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    background-color: #f8f9fa;
  }
  
  &__info {
    padding: 1.5rem;
    flex-grow: 1;
  }
}

.brand-logo {
  max-width: 80%;
  max-height: 100px;
  object-fit: contain;
}

.brand-name {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: $black;
}

.brand-country {
  color: $greyDark;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.brand-models {
  font-weight: 600;
  color: $black;
}

.brand-link {
  display: block;
  padding: 1rem 1.5rem;
  background-color: $red;
  color: $white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
  
  i {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background-color: darken($red, 10%);
    
    i {
      transform: translateX(5px);
    }
  }
}

@media (max-width: 768px) {
  .brands-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  
  .brand-card__logo {
    height: 150px;
  }
  
  .brand-name {
    font-size: 1.3rem;
  }
}
</style>