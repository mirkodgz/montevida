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
            type: 'text',
            description: 'Breve resumen de los beneficios.',
        }),
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
            name: 'images',
            title: 'Imagenes',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            validation: (Rule) => Rule.required().min(1),
            description: 'Sube al menos 1 imagen. Idealmente 2 para el efecto al pasar el mouse.',
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
            media: 'images.0',
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
