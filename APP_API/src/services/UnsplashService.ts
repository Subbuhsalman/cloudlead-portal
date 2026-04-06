
import axios from 'axios';

const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

class UnsplashService {
  client: any;
  constructor(ACCESS_KEY: string) {
    this.client = axios.create({
      baseURL: UNSPLASH_BASE_URL,
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
    });
  }

  /** 🔍 Search photos */
  async searchPhotos(query, page = 1, perPage = 10) {
    const { data } = await this.client.get('/search/photos', {
      params: { query, page, per_page: perPage }
    });
    return data.results;
  }

  /** 🎲 Get random photos */
  async getRandomPhotos(count = 1, query = '') {
    const { data } = await this.client.get('/photos/random', {
      params: { count, query }
    });
    return data;
  }

  /** 📥 Download photo (trigger download tracking URL) */
  async trackDownload(downloadUrl) {
    return this.client.get(downloadUrl);
  }

  /** 🖼️ Get photo by ID */
  async getPhotoById(photoId) {
    const { data } = await this.client.get(`/photos/${photoId}`);
    return data;
  }
}

export {UnsplashService}