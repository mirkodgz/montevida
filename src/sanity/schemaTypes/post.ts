import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Entrada de Blog',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'author',
            title: 'Autor',
            type: 'reference',
            to: { type: 'author' },
        } as any),
        defineField({
            name: 'mainImage',
            title: 'Imagen principal',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'categories',
            title: 'Categorías',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'blogCategory' } }],
        } as any),
        defineField({
            name: 'publishedAt',
            title: 'Fecha de publicación',
            type: 'datetime',
        }),
        defineField({
            name: 'excerpt',
            title: 'Resumen',
            description: 'Un breve resumen de la entrada para mostrar en la cuadrícula del blog.',
            type: 'text',
        }),
        defineField({
            name: 'body',
            title: 'Cuerpo',
            type: 'blockContent',
        }),
    ],

    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage',
        },
        prepare(selection) {
            const { author } = selection
            return { ...selection, subtitle: author && `por ${author}` }
        },
    },
})
