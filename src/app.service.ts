import { BadRequestException, Injectable } from '@nestjs/common';
import { News_Category, NewsDetails } from './models/news';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { envUrl } from './assets/environment.dev';

@Injectable()
export class AppService {

  constructor(private config: ConfigService) { }

  async getNewsByCategory(category: string, lang: string): Promise<NewsDetails[]> {
    if (News_Category[category.toUpperCase()]) {
      if (lang.toLowerCase() == 'en' || lang.toLowerCase() == 'hi') {
        const API_KEY = this.config.get('NEWS_API_KEY');
        const newsResponse = await axios.get(`${envUrl.headline}?category=${category}&lang=${lang}&country=in&apikey=${API_KEY}`);
        return newsResponse.data.articles as NewsDetails[];
      }
      else {
        throw new BadRequestException('Invalid language try again...')
      }
    }
    else {
      throw new BadRequestException('Invalid category try again...');
    }
  }

  async searchNewsByLang(searchTerm:string, lang:string){
    if (lang.toLowerCase() == 'en' || lang.toLowerCase() == 'hi') {
      const API_KEY = this.config.get('NEWS_API_KEY');
      const newsResponse = await axios.get(`${envUrl.search}?q=${searchTerm}&lang=${lang}&country=in&apikey=${API_KEY}`);
      if(newsResponse.data.articles && newsResponse.data.articles.length>0){
        return newsResponse.data.articles as NewsDetails[];
      }
      else{
        throw new BadRequestException('Invalid request no records found try again...')
      }
    }
    else{
      throw new BadRequestException('Invalid language try again...')
    }
  }

}
