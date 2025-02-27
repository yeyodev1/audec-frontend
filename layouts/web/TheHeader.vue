<script setup lang="ts">
import logoShort from '@/static/logos/logo-short.png'
import logoLong from '@/static/logos/logo-long.png'
import { ref, onMounted, onUnmounted } from 'vue'

const currentLogo = ref(logoShort)
const windowWidth = ref(0)

const updateLogo = () => {
  if (import.meta.client) {
    windowWidth.value = window.innerWidth
    currentLogo.value = windowWidth.value >= 768 ? logoLong : logoShort
  }
}

onMounted(() => {
  updateLogo()
  if (import.meta.client) {
    window.addEventListener('resize', updateLogo)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', updateLogo)
  }
})
</script>

<template>
  <header class="container">
    <div class="header">
      <nuxt-link to="/">
        <figure class="header-container">
        <img 
          :src="currentLogo" 
          alt="logo de audec"
          class="header-container-logo">
      </figure>
      </nuxt-link>
    <nav class="header-menu">
      <ul>
        <li><NuxtLink to="/about">Nosotros</NuxtLink></li>
        <li><NuxtLink to="/brands">Marcas</NuxtLink></li>
        <li><NuxtLink to="/contact">Contacto</NuxtLink></li>
      </ul>
    </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  .container {
    background-color: $black;
    .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    margin: 0 auto;

    border-bottom: 1px solid $greyLight;
    max-width: 1440px;
    &-container {
      display: flex;
      align-items: center;
      justify-content: center;
      &-logo {
        height: 48px; 

        @media (min-width: 768px) {
          height: 64px; 
        }
      }
    }
    &-menu {
      ul {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        li {
          a {
            color: $white;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            &:hover {
              transition: all 0.3s ease-in-out;
              color: $red;
            }
          }
        }
      }
    }
  }
  }
</style>