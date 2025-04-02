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
            
            return {
              id: modelStory.id,
              name: modelStory.content.modelName || modelStory.name,
              slug: modelStory.slug,
              imageUrl: modelPhotoUrl,
              year: modelStory.content.year || '',
              description: modelStory.content.description || ''
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
    console.log('brandSlug', brandSlug)
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
      const response = await Storyblok.get('cdn/stories', {
        token: '9gpCqqe772O7QL2swgQeXQtt',
        version: 'published',
        starts_with: `brands/${brandSlug}`,
        by_slugs: `brands/${brandSlug}/${modelSlug}`
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model details:', error);
      throw error;
    }
  }
}

// Updated test code to include getAllBrands
(async () => {
  try {
    const brandsService = new BrandsService();
    
    // Test getAllBrands
    console.log('Testing getAllBrands...');
    const allBrands = await brandsService.getAllBrands();
    console.log('All Brands:', allBrands);

    // Test getBrandDetails
    // console.log('\nTesting getBrandDetails for Chevrolet...');
    // const brandDetails = await brandsService.getBrandDetails('chevrolet');
    // console.log('Brand Details:', brandDetails);

    // // Test getModelDetails
    // console.log('\nTesting getModelDetails for Chevrolet Camioneta...');
    // const modelDetails = await brandsService.getModelDetails('chevrolet', 'camioneta');
    // console.log('Model Details:', modelDetails);
  } catch (error) {
    console.error('Test Error:', error);
  }
})();