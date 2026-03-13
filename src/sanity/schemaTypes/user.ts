import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'user',
  title: 'Usuario',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Correo',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password',
      title: 'Contraseña (Hash)',
      description: 'Hash de la contraseña cifrada. No modificar manualmente.',
      type: 'string',
      readOnly: true,
      hidden: true, // Se esconde para que los admins no la vean ni editen en el Studio
    }),
    defineField({
      name: 'provider',
      title: 'Proveedor de Login',
      type: 'string',
      options: {
        list: [
          { title: 'Credenciales', value: 'credentials' },
          { title: 'Google', value: 'google' },
        ],
      },
      initialValue: 'credentials',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      options: {
        list: [
          { title: 'Administrador', value: 'admin' },
          { title: 'Cliente', value: 'customer' },
        ],
      },
      initialValue: 'customer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'resetPasswordToken',
      title: 'Token de Recuperación',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetPasswordExpires',
      title: 'Expiración del Token',
      type: 'datetime',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
})
