import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Pedido',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Número de Pedido',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'user',
      title: 'Cliente',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    } as any),
    defineField({
      name: 'items',
      title: 'Productos Comprados',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Producto',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'quantity',
              title: 'Cantidad',
              type: 'number',
            },
            {
              name: 'priceAtPurchase',
              title: 'Precio Venta Unitario (S/.)',
              description: 'El precio fijo que el cliente pagó en el momento de la compra.',
              type: 'number',
            },
          ],
          preview: {
            select: {
              title: 'product.title',
              subtitle: 'quantity',
              media: 'product.images.0',
            },
            prepare(selection) {
              const { title, subtitle, media } = selection
              return {
                title: title,
                subtitle: `Cant: ${subtitle}`,
                media: media,
              }
            },
          },
        },
      ],
    } as any),
    defineField({
      name: 'totalAmount',
      title: 'Monto Total (S/.)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Método de Pago',
      type: 'string',
      options: {
        list: [
          { title: 'Transferencia Bancaria', value: 'transferencia' },
          { title: 'Yape / Plin', value: 'yape' },
          { title: 'Pago Contra Entrega', value: 'contra_entrega' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado de Pago / Preparación',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente de Pago', value: 'pending' },
          { title: 'Pagado', value: 'paid' },
          { title: 'En Preparación', value: 'processing' },
          { title: 'Enviado', value: 'shipped' },
          { title: 'Entregado', value: 'delivered' },
          { title: 'Cancelado', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Dirección de Entrega',
      type: 'object',
      fields: [
        { name: 'fullName', title: 'Nombre de quien recibe', type: 'string' },
        { name: 'address', title: 'Dirección', type: 'string' },
        { name: 'city', title: 'Ciudad/Distrito', type: 'string' },
        { name: 'phone', title: 'Teléfono de Contacto', type: 'string' },
        { name: 'email', title: 'Correo de Contacto', type: 'string' },
        { name: 'notes', title: 'Notas Adicionales', type: 'text' },
      ],
    } as any),
    defineField({
      name: 'orderDate',
      title: 'Fecha del Pedido',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'orderNumber',
      customerName: 'user.name',
      status: 'status',
      total: 'totalAmount'
    },
    prepare({ title, customerName, status, total }) {
      const statusMap: Record<string, string> = {
        pending: 'Pendiente',
        paid: 'Pagado',
        processing: 'Procesando',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado'
      }
      return {
        title: `Pedido: ${title || 'Sin número'}`,
        subtitle: `${customerName} - S/.${total} - Estado: ${status ? statusMap[status] : ''}`
      }
    }
  }
})
