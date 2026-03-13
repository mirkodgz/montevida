export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number | string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  categories?: string[];
  shortDescription?: string;
  presentation?: string;
  slug?: string;
  isHeroCarousel?: boolean;
  isHeroOferta?: boolean;
  isPromoSection?: boolean;
};
