import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Ad } from '../entity/ad.entity';

@Provide()
export class AdService {
  @InjectEntityModel(Ad)
  adModel: Repository<Ad>;

  async getSplashAd(): Promise<Ad | null> {
    const now = new Date();

    const ad = await this.adModel.findOne({
      where: {
        status: 'active',
        startTime: MoreThanOrEqual(now),
        endTime: LessThanOrEqual(now),
      },
      order: { sort: 'ASC' },
    });

    if (!ad) {
      return {
        id: 0,
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1600&fit=crop',
        linkUrl: null,
        duration: 3,
        startTime: null,
        endTime: null,
        status: 'active',
        sort: 0,
        createdAt: new Date(),
      } as Ad;
    }

    return ad;
  }
}
