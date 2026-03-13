import { createClient } from '@sanity/client';
import xlsx from 'xlsx';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Sanity client configuration
// Loading from .env.local because this will be run locally via ts-node
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false, // Turn off CDN for writes
    token: process.env.SANITY_API_TOKEN,
});

async function downloadImage(url: string): Promise<Buffer> {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });
    return Buffer.from(response.data, 'binary');
}

async function uploadImageToSanity(imageBuffer: Buffer, filename: string) {
    return await client.assets.upload('image', imageBuffer, {
        filename,
    });
}

async function run() {
    console.log('Starting image import process...');

    const EXCEL_PATH = '/Users/mirkodgz/Projects/montevida/PuntoClickStore_ProductosGomitas (4).xlsx';
    const workbook = xlsx.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read Excel data
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    // Group images by handle (slug)
    const productImagesMap: Record<string, string[]> = {};

    data.forEach((row) => {
        const handle = row['Handle'];
        const imageUrl = row['Image Src'];

        if (handle && imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            if (!productImagesMap[handle]) {
                productImagesMap[handle] = [];
            }
            productImagesMap[handle].push(imageUrl);
        }
    });

    const handles = Object.keys(productImagesMap);
    console.log(`Found ${handles.length} products with images in Excel.`);

    for (const handle of handles) {
        try {
            console.log(`\nProcessing images for product slug: ${handle}`);

            // 1. Find the product document in Sanity by its slug
            const sanityProduct = await client.fetch(`*[_type == "product" && slug.current == "${handle}"][0]`);

            if (!sanityProduct) {
                console.warn(`⚠️ Sanity Product not found for slug: ${handle}. Skipping...`);
                continue;
            }

            console.log(`Found Sanity product: ${sanityProduct.title} (${sanityProduct._id})`);

            // We will upload exactly these URLs to Sanity
            const imageUrls = productImagesMap[handle];
            const sanityImageAssetRefs: any[] = [];

            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                try {
                    console.log(`Downloading image [${i + 1}/${imageUrls.length}]: ${url.substring(0, 50)}...`);
                    const imageBuffer = await downloadImage(url);

                    // Basic filename guessing from URL
                    const filename = path.basename(new URL(url).pathname) || `image-${i}.jpg`;

                    console.log(`Uploading to Sanity Assets...`);
                    const uploadedAsset = await uploadImageToSanity(imageBuffer, filename);

                    console.log(`Successfully uploaded: ${uploadedAsset.assetId}`);

                    sanityImageAssetRefs.push({
                        _type: 'image',
                        _key: `image-${Date.now()}-${i}`,
                        asset: {
                            _type: 'reference',
                            _ref: uploadedAsset._id
                        }
                    });

                } catch (imgError: any) {
                    console.error(`Failed to download or upload image URL ${url}: ${imgError.message}`);
                }
            }

            if (sanityImageAssetRefs.length > 0) {
                console.log(`Attaching ${sanityImageAssetRefs.length} images to product ${sanityProduct._id}...`);

                // Setup mutatation
                await client
                    .patch(sanityProduct._id)
                    .setIfMissing({ images: [] })
                    .set({ images: sanityImageAssetRefs })
                    .commit();

                console.log(`✅ Success for ${sanityProduct.title}`);
            } else {
                console.log(`No images could be uploaded for ${sanityProduct.title}`);
            }

        } catch (error: any) {
            console.error(`Error processing handle ${handle}: ${error.message}`);
        }
    }

    console.log('\n✅ Script complete!');
}

run().catch(console.error);
