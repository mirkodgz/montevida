import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getStoreProducts } from "@/sanity/lib/queries";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | Monte Vida Peru",
  description: "This is Shop Page",
  // other metadata
};

const ShopWithoutSidebarPage = async () => {
  const products = await getStoreProducts();

  return (
    <main>
      <ShopWithoutSidebar products={products} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
