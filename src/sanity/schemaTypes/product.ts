import { defineField, defineType, defineArrayMember } from 'sanity'

export const productType = defineType({
    name: 'product',
    title: 'Producto',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Nombre del Producto',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Precio Regular',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'discountedPrice',
            title: 'Precio de Oferta / Descuento',
            description: 'Déjalo en blanco si no hay oferta',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: 'shortDescription',
            title: 'Descripcion Corta',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Breve resumen de los beneficios. Puedes usar negritas y saltos de línea.',
        } as any),
        defineField({
            name: 'presentation',
            title: 'Cantidad / Presentacion',
            type: 'string',
            description: 'Ej: Frasco de 60 cápsulas, Polvo 200g, etc.',
        }),
        defineField({
            name: 'categories',
            title: 'Categorias',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        } as any),
        defineField({
            name: 'mainImage',
            title: 'Foto Principal',
            type: 'image',
            description: 'Esta será la imagen de portada del producto y la que aparecerá en los listados.',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'gallery',
            title: 'Fotos Variadas (Galería)',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            description: 'Estas son las imágenes adicionales que se mostrarán en la página individual del producto (debajo de la foto principal).',
        } as any),
        defineField({
            name: 'isHeroCarousel',
            title: '¿Mostrar en Slider Principal (Primera Plana)?',
            type: 'boolean',
            description: 'Actívalo para que el producto aparezca en el carrusel grande de la izquierda en el Inicio.',
            initialValue: false,
        }),
        defineField({
            name: 'isHeroOferta',
            title: '¿Mostrar en Cuadros de Oferta (Derecha)?',
            type: 'boolean',
            description: 'Actívalo para que el producto aparezca en los dos recuadros fijos de la derecha en el Inicio.',
            initialValue: false,
        }),
        defineField({
            name: 'isPromoSection',
            title: '¿Mostrar en Sección Promocional (Banner Central)?',
            type: 'boolean',
            description: 'Actívalo para que el producto aparezca en el banner del medio de la página (con el cronómetro). Si hay más de uno, se tomará el más reciente.',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
            price: 'price',
        },
        prepare(selection) {
            const { title, media, price } = selection
            return {
                title,
                subtitle: price ? `S/. ${price}` : 'Sin precio',
                media,
            }
        },
    },
})
