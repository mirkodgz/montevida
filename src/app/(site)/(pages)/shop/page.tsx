import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { getStoreProducts, getSanityCategories } from "@/sanity/lib/queries";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | Monte Vida Peru",
  description: "This is Shop Page",
  // other metadata
};

const ShopWithSidebarPage = async () => {
  const storeProducts = await getStoreProducts();
  const rawCategories = await getSanityCategories();

  const categoriesList = [...rawCategories];

  return (
    <main>
      <ShopWithSidebar products={storeProducts} categoriesList={categoriesList} />
    </main>
  );
};

export default ShopWithSidebarPage;
