<script setup lang="ts">
import photoTeam from '@/static/enterprise/team.avif'
import offices from '@/static/enterprise/offices.jpeg'
</script>

<template>
  <div class="about">
    <div class="about-content">
      <div class="about-content-text">
        <h2 class="about-content-title">
          Nosotros
        </h2>
        <p>En Audec Motors, nos enorgullece ofrecerte vehículos con la última tecnología y diseño de vanguardia. Nuestro compromiso es brindarte seguridad, confort y eficiencia en cada modelo.
Desde sedanes modernos hasta camionetas robustas, tenemos el vehículo perfecto para ti. Explora nuestra gama y experimenta la excelencia automotriz con Audec Motors.
        </p>
      </div>
      <figure>
        <img :src="photoTeam" alt="foto del team">
      </figure>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: $white;

  &-content {
    max-width: 1200px;
    width: 100%;
    background-color: $greyLight;
    padding: 32px;
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    box-shadow: 0 8px 24px rgba($black, 0.08);

    &-text {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      &-title {
        font-size: 2.5rem;
        color: $red;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        font-weight: 700;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 4px;
          background-color: $red;
          border-radius: 2px;
        }
      }

      p {
        font-size: 1.2rem;
        line-height: 1.8;
        color: $black;
        text-align: justify;
        margin-bottom: 1rem;
      }
    }

    figure {
      flex: 1;
      min-width: 300px;
      height: 500px;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba($black, 0.12);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba($black, 0.2);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.5s ease;
        border-radius: 8px;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;

    &-content {
      padding: 24px;
      gap: 2rem;

      &-text {
        &-title {
          font-size: 2rem;
          text-align: center;

          &::after {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }

      figure {
        height: 300px;
      }
    }
  }
}
</style>