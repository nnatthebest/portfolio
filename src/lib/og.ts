import { getImage } from 'astro:assets';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export interface OgImage {
  src: string;
  width: number;
  height: number;
}

/** Cover cropped to the 1200×630 social-preview size at build time, as a JPG. */
export async function getOgImage(cover: ImageMetadata): Promise<OgImage> {
  const image = await getImage({
    src: cover,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fit: 'cover',
    format: 'jpg',
  });

  return { src: image.src, width: OG_WIDTH, height: OG_HEIGHT };
}
