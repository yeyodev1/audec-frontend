<script setup>
const images = [
  'https://i.pinimg.com/474x/8d/81/14/8d8114ddbcb7a28080b420a07a6247ed.jpg',
  'https://i.pinimg.com/474x/0c/f3/cf/0cf3cfeb3d172f496cb4d930ce449c8d.jpg',
  'https://i.pinimg.com/474x/3e/89/94/3e89948a252c93270dde698572d43559.jpg'
];
</script>

<template>
  <div class="hero">
    <div class="hero__carousel">
      <div class="hero__slides">
        <div v-for="(image, index) in images" :key="index" class="hero__slide">
          <img :src="image" alt="Carousel Image" class="hero__image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $black;
  overflow: hidden;


  &__carousel {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  &__slides {
    display: flex;
    width: 300%;
    animation: slide 15s ease-in-out infinite;
    height: 100%;
  }

  &__slide {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100%;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: opacity 0.5s ease;
  }

  @keyframes slide {
    0%, 28% { transform: translateX(0); }
    33%, 61% { transform: translateX(-100%); }
    66%, 94% { transform: translateX(-200%); }
    100% { transform: translateX(0); }
  }
}
</style>