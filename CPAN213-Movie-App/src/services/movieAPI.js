const API_KEY = '0102a8db6d84957ee6419a89d977be92';
const BASE_URL = 'https://api.themoviedb.org/3';

const cache = {};
const CACHE_DURATION = 5 * 60 * 1000;

export const movieAPI = {
  async getTrending(timeWindow = 'day') {
    const cacheKey = `trending_${timeWindow}`;
    
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    try {
      const url = `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trending movies: ${response.status}`);
      }
      
      const data = await response.json();
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('getTrending error:', error);
      throw error;
    }
  },

  async searchMovies(query, page = 1) {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const cacheKey = `search_${query}_${page}`;
    
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    try {
      const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('searchMovies error:', error);
      throw error;
    }
  },

  async getMovieDetails(movieId) {
    const cacheKey = `details_${movieId}`;
    
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    try {
      const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }
      
      const data = await response.json();
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('getMovieDetails error:', error);
      throw error;
    }
  },

  async getPopularMovies(page = 1) {
    const cacheKey = `popular_${page}`;
    
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      return cache[cacheKey].data;
    }

    try {
      const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch popular movies: ${response.status}`);
      }
      
      const data = await response.json();
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    } catch (error) {
      console.error('getPopularMovies error:', error);
      throw error;
    }
  },

  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  clearCache() {
    Object.keys(cache).forEach(key => delete cache[key]);
  }
};

export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};