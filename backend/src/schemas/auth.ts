import { Type, Static } from '@sinclair/typebox';

export const RegisterDataSchema = Type.Object({
    email:    Type.String({ format: 'email', minLength: 5, maxLength: 254 }),
    nickname: Type.String({ minLength: 3, maxLength: 15, pattern: '^[a-zA-Z0-9_]+$' }),
    password: Type.String({ minLength: 8, maxLength: 128 }),
})

export type RegisterDataRequest = Static<typeof RegisterDataSchema>

export const LoginDataSchema = Type.Object({
    email:    Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),
})

export type LoginDataRequest = Static<typeof LoginDataSchema>;

export const EmailParamSchema = Type.Object({
    email: Type.String({ format: 'email' }),
})

export const NicknameParamSchema = Type.Object({
    nickname: Type.String({ minLength: 3, maxLength: 15 }),
})