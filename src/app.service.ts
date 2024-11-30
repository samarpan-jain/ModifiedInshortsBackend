import { BadRequestException, Injectable } from '@nestjs/common';
import { News_Category, NewsDetails } from './models/news';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { envUrl } from './assets/environment.dev';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

@Injectable()
export class AppService {

  llm: ChatFireworks;

  constructor(private config: ConfigService) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
    this.llm = new ChatFireworks({
      model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
      temperature: 0.7
    });
  }

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

  async searchNewsByLang(searchTerm: string, lang: string) {
    if (lang.toLowerCase() == 'en' || lang.toLowerCase() == 'hi') {
      const API_KEY = this.config.get('NEWS_API_KEY');
      const newsResponse = await axios.get(`${envUrl.search}?q=${searchTerm}&lang=${lang}&country=in&apikey=${API_KEY}`);
      if (newsResponse.data.articles && newsResponse.data.articles.length > 0) {
        return newsResponse.data.articles as NewsDetails[];
      }
      else {
        throw new BadRequestException('Invalid request no records found try again...')
      }
    }
    else {
      throw new BadRequestException('Invalid language try again...')
    }
  }

  async getNewsSourceSummary(url: string) {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    const prompt = ChatPromptTemplate.fromTemplate(`Write a 5 lines summary of the news based on the following:\\n\\n{context}`)
    const chain = await createStuffDocumentsChain({ llm: this.llm, prompt });
    const response = await chain.invoke({ "context": docs });
    return response
  }

}
