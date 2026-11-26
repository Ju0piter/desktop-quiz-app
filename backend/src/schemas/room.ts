import { Type, type Static } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

export const RoomParamsSchema = Type.Object({
    linkCode: Type.String({ minLength: 32, maxLength: 32, pattern: '^[0-9a-f]{32}$' }),
})

export const JoinRoomParamsSchema = Type.Object({
    code: Type.String({ minLength: 6, maxLength: 6, pattern: '^[a-z0-9]+$' }),
    emoji_id: Type.Integer({minimum: 0, maximum: 11}),
    color_id: Type.Integer({minimum: 0, maximum: 11}),
    name: Type.String({ minLength: 3, maxLength: 15, pattern: '^\\S(.*\\S)?$' }),
})

export const ClientMessageSchema = Type.Union([
    Type.Object({
        type: Type.Literal('join'),
        token: Type.String({ minLength: 128, maxLength: 128, pattern: '^[0-9a-f]{128}$' })
    }),
    Type.Object({
        type: Type.Literal('start-game'),
        token: Type.String({ minLength: 128, maxLength: 128, pattern: '^[0-9a-f]{128}$' }),
    }),
    Type.Object({
        type: Type.Literal('change-master'),
        token: Type.String({ minLength: 128, maxLength: 128, pattern: '^[0-9a-f]{128}$' }),
        new_master_id: Type.String({ minLength: 25, maxLength: 25, pattern: '^c[0-9a-z]{24}$'})
    }),
    Type.Object({
        type: Type.Literal('pause-game'),
        token: Type.String({ minLength: 128, maxLength: 128, pattern: '^[0-9a-f]{128}$' }),
    }),
    Type.Object({
        type: Type.Literal('continue-game'),
        token: Type.String({ minLength: 128, maxLength: 128, pattern: '^[0-9a-f]{128}$' }),
    }),
    Type.Object({
        type: Type.Literal('answer-to-the-question'),
        token: Type.String({ minLength: 128, maxLength: 128, pattern: '^[0-9a-f]{128}$' }),
        question_id: Type.Integer({minimum: 0, maximum: 100}),
        answer_id: Type.Integer({minimum: 0, maximum: 3}),
    }),
])

export type ClientMessage = Static<typeof ClientMessageSchema>
export type RoomParams = Static<typeof RoomParamsSchema>

export const validateClientMessage = TypeCompiler.Compile(ClientMessageSchema)
