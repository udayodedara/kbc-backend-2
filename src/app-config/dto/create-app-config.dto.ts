import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsInt } from 'class-validator';

export class CreateAppConfigDto {
  @ApiProperty({
    description: 'The terms link of the application',
    default: 'http://mesmartlabs.in',
  })
  @IsString()
  @IsOptional()
  termsLink?: string = 'http://mesmartlabs.in';

  @ApiProperty({
    description: 'The privacy policy link of the application',
    default: 'http://mesmartlabs.in',
  })
  @IsString()
  @IsOptional()
  privacyPolicy?: string = 'http://mesmartlabs.in';

  @ApiProperty({
    description: 'The minimum supported version of the application',
    default: '1',
  })
  @IsString()
  @IsOptional()
  minimumSupportedVersion?: string = '1';

  @ApiProperty({
    description: 'The disclaimer text of the application',
    default: 'string',
  })
  @IsString()
  @IsOptional()
  disclaimer?: string = 'string';

  @ApiProperty({
    description: 'The play store URL of the application',
    default:
      'https://play.google.com/store/apps/details?id=com.mesmarttechno.gk_quiz_app',
  })
  @IsString()
  @IsOptional()
  playStoreUrl?: string =
    'https://play.google.com/store/apps/details?id=com.mesmarttechno.gk_quiz_app';

  @ApiProperty({
    description: 'Ads configuration as JSON (e.g. ad IDs)',
    required: false,
    type: Object,
    default: {
      ad_display: true,
      test_mode: false,
      app_id: '5843053',
      interstitialAdInterval: 10,
      bannerAdId: 'Banner_Android',
      nativeAdId: 'ca-app-pub-4110848767344003/8148107811',
      appOpenAdId: 'ca-app-pub-4110848767344003/7400926959',
      rewardedAdId: 'Rewarded_Android',
      interstitialAdId: 'Interstitial_Android',
    },
  })
  @IsObject()
  @IsOptional()
  ads?: Record<string, any> = {
    ad_display: true,
    test_mode: false,
    app_id: '5843053',
    interstitialAdInterval: 10,
    bannerAdId: 'Banner_Android',
    nativeAdId: 'ca-app-pub-4110848767344003/8148107811',
    appOpenAdId: 'ca-app-pub-4110848767344003/7400926959',
    rewardedAdId: 'Rewarded_Android',
    interstitialAdId: 'Interstitial_Android',
  };

  @ApiProperty({ description: 'Points awarded for each quiz', default: 10 })
  @IsInt()
  @IsOptional()
  quizPoints?: number = 10;

  @ApiProperty({ description: 'Ad type in integer', default: 2 })
  @IsInt()
  @IsOptional()
  adType?: number = 2;

  @ApiProperty({
    description: 'Number of daily quizzes or daily quiz value',
    default: 10,
  })
  @IsInt()
  @IsOptional()
  dailyQuizPoints?: number = 10;

  @ApiProperty({
    description: 'Secret key for authentication',
    default: '87&%vLEV^r67!?@$',
  })
  @IsString()
  secretKey: string = '87&%vLEV^r67!?@$';
}
