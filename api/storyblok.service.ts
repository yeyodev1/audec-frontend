import StoryblokClient from 'storyblok-js-client';

const baseURL = 'https://api-us.storyblok.com/v2'

const Storyblok = new StoryblokClient({
  accessToken: '9gpCqqe772O7QL2swgQeXQtt',
  cache: {
    clear: 'auto',
    type: 'memory'
  },
  endpoint: baseURL
});

export default Storyblok;