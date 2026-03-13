"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import PageTransition from "@/components/Common/PageTransition";

import ScrollToTop from "@/components/Common/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import PreLoader from "@/components/Common/PreLoader";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <PreLoader />
  ) : (
    <>
      <ReduxProvider>
        <CartModalProvider>
          <ModalProvider>
            <PreviewSliderProvider>
              
              {/* Organización JSON-LD */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "Montevida",
                    url: "https://www.montevida.pe",
                    logo: "https://www.montevida.pe/images/logo/LogoMonteVida-png.webp",
                    contactPoint: {
                      "@type": "ContactPoint",
                      telephone: "+51-999-999-999", // Cambiar por el real luego
                      contactType: "customer service",
                      areaServed: "PE",
                      availableLanguage: "es"
                    }
                  })
                }}
              />

              <Header />
              <main className="pt-[68px]">
                <PageTransition>{children}</PageTransition>
              </main>

              <QuickViewModal />
              <CartSidebarModal />
              <PreviewSliderModal />
            </PreviewSliderProvider>
          </ModalProvider>
        </CartModalProvider>
      </ReduxProvider>
      <ScrollToTop />
      <WhatsAppButton />
      <Footer />
    </>
  );
}
