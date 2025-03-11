<script setup>
import { ref } from 'vue';

const vehicles = [
  {
    id: 1,
    name: 'Sedan Luxury',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1936&auto=format&fit=crop',
    price: '$35,000'
  },
  {
    id: 2,
    name: 'SUV Premium',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop',
    price: '$45,000'
  },
  {
    id: 3,
    name: 'Sports Coupe',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1470&auto=format&fit=crop',
    price: '$60,000'
  },
  {
    id: 4,
    name: 'Electric Model',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1470&auto=format&fit=crop',
    price: '$55,000'
  },
];

const scrollContainer = ref(null);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="vehicle-selector">
    <h2 class="vehicle-selector__title">Nuestros Vehículos</h2>
    
    <div class="vehicle-selector__scroll-container">
      <button class="vehicle-selector__arrow vehicle-selector__arrow--left" @click="scrollLeft">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      
      <div class="vehicle-selector__container" ref="scrollContainer">
        <div 
          v-for="vehicle in vehicles" 
          :key="vehicle.id" 
          class="vehicle-card"
        >
          <div class="vehicle-card__image-container">
            <img :src="vehicle.image" :alt="vehicle.name" class="vehicle-card__image">
          </div>
          <div class="vehicle-card__info">
            <h3 class="vehicle-card__name">{{ vehicle.name }}</h3>
            <p class="vehicle-card__price">{{ vehicle.price }}</p>
          </div>
        </div>
      </div>
      
      <button class="vehicle-selector__arrow vehicle-selector__arrow--right" @click="scrollRight">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vehicle-selector {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  &__title {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: $black;
  }

  &__scroll-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__container {
    display: flex;
    flex-wrap: nowrap;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    padding: 1rem 0.5rem;
    
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }

  &__arrow {
    position: absolute;
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $white;
    border: none;
    box-shadow: 0 2px 8px rgba($black, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: $red;
      color: $white;
    }
    
    &--left {
      left: -20px;
    }
    
    &--right {
      right: -20px;
    }
    
    i {
      font-size: 1rem;
    }
  }
}

.vehicle-card {
  min-width: 280px;
  max-width: 280px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: $white;
  flex: 0 0 auto;

  &:hover {
    transform: translateY(-8px);

    .vehicle-card__image {
      transform: scale(1.1);
    }
  }

  &__image-container {
    height: 180px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &__info {
    padding: 1rem;
  }

  &__name {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: $black;
  }

  &__price {
    font-weight: bold;
    color: $red;
  }
}

@media (max-width: 768px) {
  .vehicle-selector__arrow {
    width: 32px;
    height: 32px;
    
    &--left {
      left: -10px;
    }
    
    &--right {
      right: -10px;
    }
  }
}
</style>