import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Autor',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'bio',
            title: 'Biografía',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ],
        } as any),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
        },
    },
})
