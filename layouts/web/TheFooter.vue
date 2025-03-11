<script setup lang="ts">

const socialMedia = [
  {
    name: 'Facebook',
    icon: 'fa-brands fa-facebook',
    link: 'URL_ADDRESS.com/yourusername'
  },
  {
    name: 'Instagram',
    icon: 'fa-brands fa-instagram',
    link: 'URL_ADDRESS.com/yourusername'
  },
  {
    name: 'LinkedIn',
    icon: 'fa-brands fa-linkedin',
    link: 'URL_ADDRESS.com/yourusername'
  },
]
</script>

<template>
  <footer class="footer">
    <div class="footer-social">
      <a
        v-for="(item, index) in socialMedia"
        :key="index"
        :href="item.link" target="_blank" rel="noopener noreferrer"
        class="footer-social-item">
        <i :class="item.icon" />
      </a>
    </div>
    <div class="footer-copy">
      <p class="footer-copy-text">
        Copyright &copy; {{ new Date().getFullYear() }}
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  align-items: center;
  background-color: $black;
  &-social {
    flex: 1;
    display: flex;
    color: $white;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    &-item {
      font-size: 1.5rem;
      color: $white;
    }
  }
  &-copy {
    &-text {
      color: $white;
    }
  }
}
</style>