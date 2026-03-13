import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SearchForm from "@/components/Blog/SearchForm";
import LatestPosts from "@/components/Blog/LatestPosts";
import LatestProducts from "@/components/Blog/LatestProducts";
import Image from "next/image";
import { getStoreProducts, getSanityPostBySlug, getSanityPosts } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { PortableText } from '@portabletext/react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getSanityPostBySlug(slug);
    if (!post) {
        return { title: 'Post no encontrado' };
    }
    return {
        title: `${post.title} | Montevida Blog`,
        description: post.excerpt || "Lee más en el blog de Montevida",
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
