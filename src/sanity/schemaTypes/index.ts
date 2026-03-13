import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { categoryType } from './category'

import author from './author'
import blogCategory from './blogCategory'
import blockContent from './blockContent'
import post from './post'
import user from './user'
import order from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [productType, categoryType, author, blogCategory, blockContent, post, user, order],
}
