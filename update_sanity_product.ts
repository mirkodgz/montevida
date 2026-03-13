import { createClient } from "@sanity/client";
import fetch from "node-fetch";

const projectId = "z5d4kdb2"; 
const dataset = "production"; 
const apiVersion = "2024-01-01";
const token = "skKu5pRaTKHsXjSHq3zKK1Czl9j39s9V2WYyNFPJ7hTW3osRw3Vb5nOqChgC4uQoJJThmuRZegsjZR0Yu67IoqJBAuAoJ3CL3YSn3UzV4gKkoeR8WzOl80U7FfMPuVaffWSnuEtgBqheCvjGV2zgOeJZHKTNCpfhAQK0cGUOnxaCAG6Lm5Q1"; 

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token, 
});

async function main() {
  try {
    const slug = "colageno-con-biotina-gomitas-sottcor-130-gomitas";
    
    // Find the product
    const query = `*[_type == "product" && slug.current == $slug][0]`;
    const product = await client.fetch(query, { slug });
    
    if (!product) {
      console.log("Product not found");
      return;
    }
    
    console.log("Found product:", product._id);
    
    // Upload image
    const imageUrl = "https://puntoclick77store.myshopify.com/cdn/shop/files/WhatsAppImage2026-01-17at7.05.02PM_3_720x720_crop_center.jpg?v=1768889478";
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    
    console.log("Uploading image...");
    const imageAsset = await client.assets.upload('image', imageBuffer, {
      filename: 'colageno-biotina.jpg'
    });
    console.log("Image uploaded:", imageAsset._id);
    
    // The description content blocks
    const newDescription = [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's1', text: '✨ ¡Tu secreto de belleza en una gomita! ✨', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's2', text: '¿Cansada de cápsulas difíciles de tragar? Cuida tu piel, cabello y uñas de la forma más rica. Nuestras gomitas están diseñadas para resaltar tu brillo natural y fortalecer tu cuerpo desde el interior.', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b3',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's3', text: '💖 Piel Radiante: Incrementa la hidratación para una apariencia más saludable.', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b4',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's4', text: '💅 Cabello y Uñas: La Biotina mejora la producción de queratina, promoviendo el crecimiento y la resistencia.', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b5',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's5', text: '🦴 Articulaciones Fuertes: Ayuda a mantener la salud y movilidad de tus articulaciones.', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b6',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's6', text: '🩹 Cicatrización: Acelera la reparación de heridas y la regeneración de tejidos.', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b7',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's7', text: '¡Empieza hoy tu cambio! 🌸', marks: [] }]
      },
      {
        _type: 'block',
        _key: 'b8',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's8', text: '📦 Detalles del producto:\nFórmula Completa: Contiene 14 elementos esenciales, incluyendo Vitaminas y Minerales.\nContenido: 130 gomitas (Tratamiento para 43 días).\nModo de uso: Solo 3 gomitas diarias.\nGarantía de Calidad: Libre de gluten, lactosa y GMO.\nRegistro Sanitario: G7704224N.\n¡Empieza hoy tu cambio y siéntete increíble! 🌸', marks: [] }]
      }
    ];

    console.log("Updating product...");
    await client
      .patch(product._id)
      .set({ 
        shortDescription: '✨ ¡Tu secreto de belleza en una gomita! ✨\n¿Cansada de cápsulas difíciles de tragar? Cuida tu piel, cabello y uñas de la forma más rica.',
        description: newDescription,
        presentation: newDescription,
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      })
      .commit();
      
    console.log("Done!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
