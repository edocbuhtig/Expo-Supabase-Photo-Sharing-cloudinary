import { Text, useWindowDimensions } from 'react-native';
import { Tables } from '../types/database.types';
import { cloudinary } from '@/lib/cloudinary';
import { AdvancedImage } from 'cloudinary-react-native';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { artisticFilter } from '@cloudinary/url-gen/actions/effect';

export default function AssetItem({ asset }: { asset: Tables<'assets'> }) {
  const { width } = useWindowDimensions();

  return (
    <AdvancedImage
      cldImg={cloudinary
        .image(asset.asset_id!)
        .resize(
          thumbnail()
            .height((width * (4 / 3)) / 2)
            .width(width / 2)
        )
        .effect(artisticFilter('al_dente'))}
      className='flex-1 w-full aspect-[3/4] rounded-lg'
    />
  );
}
