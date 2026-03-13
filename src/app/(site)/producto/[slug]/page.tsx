import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { getSanityProductBySlug } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

import type { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/image";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getSanityProductBySlug(slug);
    
    if (!product) {
        return { title: 'Producto no encontrado | Montevida' };
    }

    const title = `${product.title} | Montevida`;
    const description = product.shortDescription || "Descubre más detalles sobre nuestro producto en Montevida.";
    const productUrl = `https://montevida.pe/producto/${slug}`;
    
    let defaultImg = '/images/logo/LogoMonteVida-png.webp';
    if (product.imgs?.thumbnails && product.imgs.thumbnails.length > 0) {
        defaultImg = urlForImage(product.imgs.thumbnails[0]).url();
    }

    return {
        title,
        description,
        alternates: {
          canonical: productUrl,
        },
        openGraph: {
            title,
            description,
            url: productUrl,
            images: [
                {
                    url: defaultImg,
                    width: 800,
                    height: 800,
                    alt: product.title,
                }
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [defaultImg],
        }
    }
}

const ProductDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const product = await getSanityProductBySlug(slug);

    if (!product) {
        return notFound();
    }

    let defaultImg = 'https://www.montevida.pe/images/logo/LogoMonteVida-png.webp';
    if (product.imgs?.thumbnails && product.imgs.thumbnails.length > 0) {
        defaultImg = urlForImage(product.imgs.thumbnails[0]).url();
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: defaultImg,
      description: product.shortDescription,
      offers: {
        "@type": "Offer",
        url: `https://www.montevida.pe/producto/${slug}`,
        priceCurrency: "PEN", // Assuming soles for Montevida based on previous context
        price: product.discountedPrice || product.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock" // Assuming in stock unless proven otherwise 
      }
    };

    return (
        <main className="pt-10 lg:pt-16 xl:pt-20">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ShopDetails currentProduct={product} />
        </main>
    );
};

export default ProductDetailsPage;
