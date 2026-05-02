import { Controller, Get, Inject } from '@midwayjs/core';
import { AdService } from '../service/ad.service';

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

@Controller('/ads')
export class AdController {
  @Inject()
  adService: AdService;

  @Get('/splash')
  async getSplashAd(): Promise<IApiResponse> {
    try {
      const ad = await this.adService.getSplashAd();
      return {
        success: true,
        data: ad ? {
          id: ad.id,
          imageUrl: ad.imageUrl,
          linkUrl: ad.linkUrl,
          duration: ad.duration,
        } : null,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }
}
