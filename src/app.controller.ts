import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/news')
  getNewsByCategory(@Query('category') category: string, @Query('lang') lang: string) {
    return this.appService.getNewsByCategory(category, lang);
  }

  @Get('news/search')
  searchNewsByLang(@Query('searchTerm') searchTerm:string,@Query('lang') lang: string) {
    return this.appService.searchNewsByLang(searchTerm,lang);
  }
}
