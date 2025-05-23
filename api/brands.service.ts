import Storyblok from '@/api/storyblok.service';

export default class BrandsService {
  async getAllBrands() {
    try {
      // First get a list of brand slugs
      const response = await Storyblok.get('cdn/stories', {
        token: '9gpCqqe772O7QL2swgQeXQtt',
        version: 'published',
        starts_with: 'brands/',
        excluding_slugs: 'brands/*/[^/]*'  // Exclude model entries
      });

      // Filter out the main brands index and get only brand folders
      const brandSlugs = response.data.stories
        .filter((story: any) => 
          story.slug !== 'brands' && 
          story.is_startpage === true
        )
        .map((story: any) => story.slug);

      // Fetch detailed information for each brand directly
      const brandPromises = brandSlugs.map(async (slug: string) => {
        try {
          const brandResponse = await Storyblok.get(`cdn/stories/brands/${slug}`, {
            token: '9gpCqqe772O7QL2swgQeXQtt',
            version: 'published'
          });
          
          const brandStory = brandResponse.data.story;
          
          // Format image URL
          let photoUrl = brandStory.content.photo || null;
          if (photoUrl && photoUrl.startsWith('//')) {
            photoUrl = `https:${photoUrl}`;
          }
          
          // Get models for this brand
          const modelsResponse = await Storyblok.get('cdn/stories', {
            token: '9gpCqqe772O7QL2swgQeXQtt',
            version: 'published',
            starts_with: `brands/${slug}/`,
            excluding_slugs: `brands/${slug}/index`
          });
          
          const models = modelsResponse.data.stories.map((modelStory: any) => {
            // Format model image URL
            let modelPhotoUrl = modelStory.content.foto || null;
            if (modelPhotoUrl && modelPhotoUrl.startsWith('//')) {
              modelPhotoUrl = `https:${modelPhotoUrl}`;
            }
            
            // Process gallery images
            const galleryImages: { url: any; alt: any; }[] = [];
            
            // Add main image if it exists
            if (modelPhotoUrl) {
              galleryImages.push({
                url: modelPhotoUrl,
                alt: `${modelStory.content.modelName || modelStory.name} main image`
              });
            }
            
            // Add additional images from fotos array if it exists
            if (modelStory.content.fotos && Array.isArray(modelStory.content.fotos)) {
              modelStory.content.fotos.forEach((foto: any) => {
                // Format image URL if needed
                let fotoUrl = foto.filename || '';
                if (fotoUrl && fotoUrl.startsWith('//')) {
                  fotoUrl = `https:${fotoUrl}`;
                }
                
                // Check if the image is not already in the array (avoid duplicates)
                if (fotoUrl && !galleryImages.some(img => img.url === fotoUrl)) {
                  galleryImages.push({
                    url: fotoUrl,
                    alt: foto.alt || `${modelStory.content.modelName || modelStory.name} gallery image`
                  });
                }
              });
            }
            
            return {
              id: modelStory.id,
              name: modelStory.content.modelName || modelStory.name,
              slug: modelStory.slug,
              imageUrl: modelPhotoUrl,
              year: modelStory.content.year || '',
              description: modelStory.content.description || '',
              // Include PDF URL in the model data
              pdf: modelStory.content.pdf?.url || modelStory.content.pdf?.cached_url || '',
              fotos: modelStory.content.fotos || [], // Include raw fotos data
              images: galleryImages // Include processed gallery images
            };
          });
          
          return {
            id: brandStory.id,
            name: brandStory.content.name,
            slug: brandStory.slug,
            imageUrl: photoUrl,
            country: brandStory.content.country || '',
            description: brandStory.content.description || '',
            models: models
          };
        } catch (error) {
          console.error(`Error fetching brand ${slug}:`, error);
          return null;
        }
      });

      const brands = (await Promise.all(brandPromises)).filter(brand => brand !== null);
      return brands;
    } catch (error) {
      console.error('Error fetching all brands:', error);
      throw error;
    }
  }

  async getBrandDetails(brandSlug: string) {
    try {
      const response = await Storyblok.get('cdn/stories', {
        token: '9gpCqqe772O7QL2swgQeXQtt',
        version: 'published',
        starts_with: 'brands/',
        with_tag: brandSlug
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching brand details:', error);
      throw error;
    }
  }

  async getModelDetails(brandSlug: string, modelSlug: string) {
    try {
      const response = await Storyblok.get(`cdn/stories/brands/${brandSlug}/${modelSlug}`, {
        token: '9gpCqqe772O7QL2swgQeXQtt',
        version: 'published'
      });
      
      const modelStory = response.data.story;
      
      // Format image URL
      let imageUrl = modelStory.content.foto || null;
      if (imageUrl && imageUrl.startsWith('//')) {
        imageUrl = `https:${imageUrl}`;
      }
      
      // Process gallery images
      const galleryImages: { url: any; alt: any; }[] = [];
      
      // Add main image if it exists
      if (imageUrl) {
        galleryImages.push({
          url: imageUrl,
          alt: `${modelStory.content.modelName || modelStory.name} main image`
        });
      }
      
      // Add additional images from fotos array if it exists
      if (modelStory.content.fotos && Array.isArray(modelStory.content.fotos)) {
        modelStory.content.fotos.forEach((foto: any) => {
          // Format image URL if needed
          let fotoUrl = foto.filename || '';
          if (fotoUrl && fotoUrl.startsWith('//')) {
            fotoUrl = `https:${fotoUrl}`;
          }
          
          // Check if the image is not already in the array (avoid duplicates)
          if (fotoUrl && !galleryImages.some(img => img.url === fotoUrl)) {
            galleryImages.push({
              url: fotoUrl,
              alt: foto.alt || `${modelStory.content.modelName || modelStory.name} gallery image`
            });
          }
        });
      }
      
      // Format date if needed
      let year = modelStory.content.year || '';
      if (year && year.includes(' ')) {
        // Extract just the year part from the date string
        year = year.split(' ')[0];
      }
      
      // Create a formatted model object
      const modelDetails = {
        id: modelStory.id,
        uuid: modelStory.uuid,
        name: modelStory.content.modelName || modelStory.name,
        slug: modelStory.slug,
        fullSlug: modelStory.full_slug,
        imageUrl: imageUrl,
        year: year,
        description: modelStory.content.description || '',
        specifications: modelStory.content.specifications || {},
        features: modelStory.content.features || [],
        price: modelStory.content.price || null,
        createdAt: modelStory.created_at,
        updatedAt: modelStory.updated_at,
        publishedAt: modelStory.published_at,
        fotos: modelStory.content.fotos || [], // Include raw fotos data
        images: galleryImages // Include processed gallery images
      };
      
      return modelDetails;
    } catch (error) {
      console.error('Error fetching model details:', error);
      throw error;
    }
  }

  async getAllModelsByBrand(brandSlug: string) {
      try {
        // Get all models for the brand
        const response = await Storyblok.get('cdn/stories', {
          token: '9gpCqqe772O7QL2swgQeXQtt',
          version: 'published',
          starts_with: `brands/${brandSlug}/`,
          excluding_slugs: `brands/${brandSlug}/index` // This wasn't enough
        });
        
        // Filter out the index entry and map the remaining models
        const models = response.data.stories
          .filter((story: any) => story.slug !== brandSlug) // Add this filter
          .map((modelStory: any) => {
            // Rest of the mapping code remains the same
            let imageUrl = modelStory.content.foto || null;
            if (imageUrl && imageUrl.startsWith('//')) {
              imageUrl = `https:${imageUrl}`;
            }
            
            let year = modelStory.content.year || '';
            if (year && year.includes(' ')) {
              year = year.split(' ')[0];
            }
            
            return {
              id: modelStory.id,
              uuid: modelStory.uuid,
              name: modelStory.content.modelName || modelStory.name,
              slug: modelStory.slug,
              fullSlug: modelStory.full_slug,
              imageUrl: imageUrl,
              year: year,
              description: modelStory.content.description || '',
              price: modelStory.content.price || null,
              createdAt: modelStory.created_at,
              updatedAt: modelStory.updated_at
            };
          });
        
        return models;
      } catch (error) {
        console.error(`Error fetching models for brand ${brandSlug}:`, error);
        throw error;
      }
    }
}

// // Updated test code
// (async () => {
//   try {
//     const brandsService = new BrandsService();
    
//     // Test getAllBrands
//     console.log('\nTesting getAllBrands...');
//     const allBrands = await brandsService.getAllBrands();
//     console.log('All Brands:', allBrands);

//     // Test getAllModelsByBrand
//     console.log('\nTesting getAllModelsByBrand for Hyundai...');
//     const hyundaiModels = await brandsService.getAllModelsByBrand('hyundai');
//     console.log('Hyundai Models:', hyundaiModels);

//     // Test getModelDetails for a specific model
//     console.log('\nTesting getModelDetails for Hyundai Sedan...');
//     const sedanDetails = await brandsService.getModelDetails('hyundai', 'sedan');
//     console.log('Sedan Details:', sedanDetails);

//   } catch (error) {
//     console.error('Test Error:', error);
//   }
// })();