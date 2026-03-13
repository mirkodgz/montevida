import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "z5d4kdb2",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: "skKu5pRaTKHsXjSHq3zKK1Czl9j39s9V2WYyNFPJ7hTW3osRw3Vb5nOqChgC4uQoJJThmuRZegsjZR0Yu67IoqJBAuAoJ3CL3YSn3UzV4gKkoeR8WzOl80U7FfMPuVaffWSnuEtgBqheCvjGV2zgOeJZHKTNCpfhAQK0cGUOnxaCAG6Lm5Q1"
});

async function main() {
  try {
    const slugs = ["colageno-con-biotina-gomitas-sottcor-130-gomitas"];
    
    for (const slug of slugs) {
      const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug });
      if (product) {
        await client.patch(product._id).set({
          isHeroCarousel: true,
          isHeroOferta: true
        }).commit();
        console.log("Updated", slug);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

main();
