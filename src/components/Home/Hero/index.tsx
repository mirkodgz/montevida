import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

const Hero = ({ products }: { products: Product[] }) => {
  const carouselProducts = products.filter((p) => p.isHeroCarousel);
  const offerProducts = products.filter((p) => p.isHeroOferta).slice(0, 2);

  // Fallback defaults just in case no products are marked in Sanity
  const fallbackOffer1 = {
    title: "iPhone 14 Plus & 14 Pro Max",
    slug: "#",
    price: 699,
    discountedPrice: 999,
    image: "/images/hero/hero-02.png"
  };

  const fallbackOffer2 = {
    title: "Wireless Headphone",
    slug: "#",
    price: 699,
    discountedPrice: 999,
    image: "/images/hero/hero-01.png"
  };

  const offer1 = offerProducts.length > 0 ? {
    title: offerProducts[0].title,
    slug: `/producto/${offerProducts[0].slug}`,
    price: offerProducts[0].price,
    discountedPrice: offerProducts[0].discountedPrice,
    image: offerProducts[0].imgs?.thumbnails[0] || "/images/hero/hero-02.png"
  } : fallbackOffer1;

  const offer2 = offerProducts.length > 1 ? {
    title: offerProducts[1].title,
    slug: `/producto/${offerProducts[1].slug}`,
    price: offerProducts[1].price,
    discountedPrice: offerProducts[1].discountedPrice,
    image: offerProducts[1].imgs?.thumbnails[0] || "/images/hero/hero-01.png"
  } : fallbackOffer2;

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel products={carouselProducts} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex items-center justify-center h-full">
              <div className="w-full h-full relative rounded-[10px] bg-white p-4 sm:p-7.5 flex flex-col justify-center items-center text-center">
                <div className="w-[180px] shrink-0 mb-6 sm:mb-8">
                  <Image
                    src={offer1.image}
                    alt={offer1.title}
                    width={180}
                    height={180}
                    className="object-contain mx-auto"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-dark text-xl sm:text-2xl mb-4 sm:mb-6">
                    <Link href={offer1.slug}> {offer1.title} </Link>
                  </h2>

                  <div>
                    <p className="font-medium text-dark-4 text-custom-sm mb-2.5">
                      Oferta por tiempo limitado
                    </p>
                    <span className="flex items-center justify-center gap-3">
                      <span className="font-medium text-heading-5 text-red">
                        S/. {offer1.price}
                      </span>
                      {offer1.discountedPrice && (
                        <span className="font-medium text-2xl text-dark-4 line-through">
                          S/. {offer1.discountedPrice}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
