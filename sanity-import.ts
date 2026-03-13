import { createClient } from '@sanity/client'
import fs from 'fs'
import csv from 'csv-parser'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error("Missing Sanity credentials in .env.local");
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-10',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
})

async function cleanup() {
    console.log("Cleaning up malformed products...");
    const oldProducts = await client.fetch('*[_type == "product" && !defined(title)]');
    console.log(`Found ${oldProducts.length} undefined products to delete.`);
    for (const p of oldProducts) {
        await client.delete(p._id);
    }
}

async function run() {
    await cleanup();

    const results: any[] = [];
    // Use strip-bom stream or mapHeaders
    fs.createReadStream('productos_sanity_import_normalizado.csv')
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, '')
        }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`Found ${results.length} products to import. Starting...`);

            for (const row of results) {
                try {
                    const categoryName = row.categoria?.trim();
                    let catId = null;
                    if (categoryName) {
                        const existing = await client.fetch('*[_type == "category" && title == $title][0]', { title: categoryName });
                        catId = existing ? existing._id : null;
                        if (!catId) {
                            const created = await client.create({
                                _type: 'category',
                                title: categoryName,
                                slug: { _type: 'slug', current: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
                            });
                            catId = created._id;
                        }
                    }

                    const productName = row.nombre_producto?.trim();
                    if (!productName) {
                        console.log("Skipping empty row");
                        continue;
                    }

                    const doc: any = {
                        _type: 'product',
                        title: productName,
                        slug: { _type: 'slug', current: row.slug || productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
                        price: parseFloat(row.precio_regular),
                        shortDescription: row.descripcion_corta?.trim() || '',
                        presentation: row.cantidad_presentacion || '',
                        categories: catId ? [
                            {
                                _type: 'reference',
                                _ref: catId,
                                _key: Math.random().toString(36).substring(7)
                            }
                        ] : []
                    };

                    if (row.precio_oferta && !isNaN(parseFloat(row.precio_oferta))) {
                        doc.discountedPrice = parseFloat(row.precio_oferta);
                    }

                    const result = await client.create(doc);
                    console.log(`✅ Imported: ${doc.title}`);
                } catch (err: any) {
                    console.error(`❌ Failed to import ${row.nombre_producto}:`, err.message);
                }
            }

            console.log('🎉 Finished importing all products!');
        });
}

run();
