import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import { getStoreProducts } from "@/sanity/lib/queries";

const Home = async () => {
  const products = await getStoreProducts();

  return (
    <main>
      <Hero products={products} />
      <Categories />
      <NewArrival />
      <CounDown promoProduct={products.find(p => p.isPromoSection)} />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
