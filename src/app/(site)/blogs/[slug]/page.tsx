import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SearchForm from "@/components/Blog/SearchForm";
import LatestPosts from "@/components/Blog/LatestPosts";
import LatestProducts from "@/components/Blog/LatestProducts";
import Image from "next/image";
import { getStoreProducts, getSanityPostBySlug, getSanityPosts } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { PortableText } from '@portabletext/react'

import type { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/image";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getSanityPostBySlug(slug);
    
    if (!post) {
        return { title: 'Artículo no encontrado | Montevida Blog' };
    }

    const title = `${post.title} | Montevida Blog`;
    const description = post.excerpt || "Lee más en el blog de Montevida. Información sobre salud, bienestar y productos naturales.";
    const articleUrl = `https://montevida.pe/blogs/${slug}`;
    
    // Asumimos que post.img podría ser una URL cruda o un string. Ajustalo si es un objeto de Sanity
    const defaultImg = post.img || '/images/logo/LogoMonteVida-png.webp';

    return {
        title,
        description,
        alternates: {
          canonical: articleUrl,
        },
        openGraph: {
            title,
            description,
            url: articleUrl,
            images: [
                {
                    url: defaultImg,
                    width: 800,
                    height: 500,
                    alt: post.title,
                }
            ],
            type: "article",
            publishedTime: post.date, // Añadiendo tiempo de publicación de OPenGraph para artículos
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [defaultImg],
        }
    }
}

const BlogPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const post = await getSanityPostBySlug(slug);
    if (!post) return notFound();

    const storeProducts = await getStoreProducts();
    const latestPosts = await getSanityPosts();

    return (
        <>
            <Breadcrumb
                title={post.title}
                pages={["Blog", post.title]}
            />
            <section className="overflow-hidden py-20 bg-gray-2">
                <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-12.5">
                        {/* <!-- blog details --> */}
                        <div className="lg:max-w-[750px] w-full">
                            <div className="rounded-[10px] overflow-hidden mb-7.5">
                                <Image
                                    className="rounded-[10px] w-full object-cover"
                                    src={post.img}
                                    alt={post.title}
                                    width={750}
                                    height={477}
                                />
                            </div>

                            <div>
                                <span className="flex items-center gap-3 mb-4">
                                    <span className="ease-out duration-200 text-dark-4">
                                        {post.date}
                                    </span>

                                    {/* <!-- divider --> */}
                                    <span className="block w-px h-4 bg-gray-4"></span>

                                    <span className="ease-out duration-200 text-dark-4">
                                        Montevida
                                    </span>
                                </span>

                                <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-6">
                                    {post.title}
                                </h2>

                                <div className="prose prose-lg max-w-none prose-img:rounded-xl">
                                    {post.body ? (
                                        <PortableText value={post.body} />
                                    ) : (
                                        <p>Contenido principal del artículo.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* <!-- blog sidebar --> */}
                        <div className="lg:max-w-[370px] w-full">
                            {/* <!-- search box --> */}
                            <SearchForm />

                            {/* <!-- Recent Posts box --> */}
                            <LatestPosts blogs={latestPosts} />

                            {/* <!-- Latest Products box --> */}
                            <LatestProducts products={storeProducts} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BlogPostPage;
