import { Type, Static } from '@sinclair/typebox';

export const SlugDataSchema = Type.Object({
    slug: Type.String({ minLength: 3, maxLength: 15, pattern: '^[a-z-]+$' }),
})

export type GetQuizDataRequest = Static<typeof SlugDataSchema>