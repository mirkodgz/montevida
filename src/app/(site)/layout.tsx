import type { Metadata } from 'next';
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.montevida.pe'),
  title: {
    template: '%s | Montevida',
    default: 'Montevida | Suplementos y Productos Naturales',
  },
  description: 'Descubre los mejores suplementos y productos naturales en Montevida. Calidad, bienestar y salud en cada gota.',
  keywords: ['suplementos', 'natural', 'salud', 'bienestar', 'montevida', 'vitaminas', 'peru'],
  authors: [{ name: 'Montevida' }],
  openGraph: {
    title: 'Montevida | Suplementos y Productos Naturales',
    description: 'Descubre los mejores suplementos y productos naturales en Montevida. Calidad, bienestar y salud.',
    url: 'https://www.montevida.pe',
    siteName: 'Montevida',
    images: [
      {
        url: '/images/logo/LogoMonteVida-png.webp',
        width: 800,
        height: 600,
        alt: 'Logo Montevida',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
