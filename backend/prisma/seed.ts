import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
})

const quiz = 
    {
        slug: "space",
        title: "Космический квиз",
        tagline: "Планеты, звёзды и тайны Вселенной",
        image_url: "https://images.wallpaperscraft.ru/image/single/devushka_kosmonavt_skafandr_1060058_1600x900.jpg",
        description: "Отправляйтесь в межзвёздное путешествие! Проверьте, насколько хорошо вы знаете Солнечную систему, историю космонавтики и загадки дальнего космоса. Вопросы от лёгких до самых сложных — от «Какая планета красная?» до «Как называется ближайшая к нам чёрная дыра?»",
        category: "science",
        difficulty: "Easy",
        duration: 15,
    }

const quiz2 = 
    {
        slug: "movie",
        title: "Киноквиз",
        tagline: "Фильмы, актёры и тайны голливуда",
        description: "Погрузитесь в мир кино! Проверьте, насколько хорошо вы знаете историю кинематографа, любимых актёров и запутанные сюжеты фильмов. Вопросы от лёгких до самых сложных — от «Какой фильм получил Оскар?» до «Кто играет главную роль в фильме «Титаник»?»",
        image_url: "https://images-s.kinorium.com/movie/shot/11813389/w1500_54376140.jpg",
        category: "entertainment",
        difficulty: "Easy",
        duration: 15,
    }

const questions = [
    {
        question: "Какая планета известна как Красная планета?",
        options: ["Марс", "Юпитер", "Венера", "Сатурн"],
        answer_id: 0,
        is_sample: true
    },
    {
        question: "Какая планета является самой большой в Солнечной системе?",
        options: ["Уран", "Сатурн", "Юпитер", "Нептун"],
        answer_id: 2,
        is_sample: true
    },
    {
        question: "Какая планета известна своими кольцами?",
        options: ["Меркурий", "Марс", "Венера", "Сатурн"],
        answer_id: 3,
        is_sample: false
    },
    {
        question: "Какая планета находится ближе всего к Солнцу?",
        options: ["Меркурий", "Венера", "Земля", "Марс"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Какая планета известна как голубая планета?",
        options: ["Нептун", "Земля", "Уран", "Сатурн"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Как называется ближайшая к нам чёрная дыра?",
        options: ["Проксима Центавра", "Солнце", "Плеяды", "Карликовая"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Какая планета является самой холодной в Солнечной системе?",
        options: ["Земля", "Уран", "Нептун", "Меркурий"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Кто первым вышел в открытый космос?",
        options: ["Юрий Гагарин", "Джон Гленн", "Алексей Леонов", "Валентина Терешкова"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Как называлась черная дыра в фильме Интерстеллар?",
        options: ["Геркулес", "Пантагрюэль", "Плеяда", "Гаргантюа"],
        answer_id: 3,
        is_sample: false
    },
    {
        question: "Что обычно остается в центре после взрыва сверхновой массивной звезды, если масса оставшегося ядра не превышает предел для коллапса в черную дыру?",
        options: ["Нейтронная звезда", "Белый карлик", "Солнце", "Чёрная дыра"],
        answer_id: 0,
        is_sample: false
    }
]

const questions2 = [
    {
        question: "Какой фильм получил Оскар за лучший фильм в 2020 году?",
        options: ["1917", "Паразиты", "Джокер", "Однажды в Голливуде"],
        answer_id: 1,
        is_sample: true
    },
    {
        question: "Кто сыграл главную роль в фильме «Титаник»?",
        options: ["Брэд Питт", "Леонардо Ди Каприо", "Джонни Депп", "Мэтт Дэймон"],
        answer_id: 1,
        is_sample: true
    },
    {
        question: "Какой режиссёр снял фильм «Начало» (Inception)?",
        options: ["Стивен Спилберг", "Кристофер Нолан", "Мартин Скорсезе", "Джеймс Кэмерон"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какой фильм является частью киновселенной Marvel?",
        options: ["Темный рыцарь", "Железный человек", "Матрица", "Гарри Поттер"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Кто сыграл главную роль в фильме «Форрест Гамп»?",
        options: ["Том Хэнкс", "Роберт Дауни мл.", "Джон Траволта", "Брэд Питт"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Какой фильм является ремейком классического фильма «Запах женщины»?",
        options: ["Семь жизней", "Секреты Лос-Анджелеса", "Запах женщины", "Красотка"],
        answer_id: 2,
        is_sample: false  
    },
    {
        question: "Кто сыграл главную роль в фильме «Матрица»?",
        options: ["Киану Ривз", "Брюс Уиллис", "Арнольд Шварценеггер", "Сильвестр Сталлоне"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Какой фильм является частью трилогии «Властелин колец»?",
        options: ["Хоббит", "Гарри Поттер", "Властелин колец", "Звёздные войны"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Кто сыграл главную роль в фильме «Джокер» (2019)?",
        options: ["Хоакин Феникс", "Джаред Лето", "Бен Аффлек", "Джонни Депп"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Какой фильм является частью киновселенной DC?",
        options: ["Чудо-женщина", "Железный человек", "Капитан Америка", "Тор"],
        answer_id: 0,
        is_sample: false
    }
]


async function main() {
    console.log("Seeding quiz...")
    await prisma.quiz.create({
        data: quiz2,
    })
    for (const question of questions2) {
        await prisma.question.create({
            data:{
                quizId: 1,
                question: question.question,
                options: {create: question.options.map((option) => ({ option }))},
                answer_id: question.answer_id,
                is_sample: question.is_sample
            }
        });
    }
    console.log("ok...")
}

main()
    .catch((error) => {
        console.error("Seed failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });