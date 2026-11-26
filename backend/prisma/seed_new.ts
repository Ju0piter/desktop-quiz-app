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
        slug: "geography",
        title: "Геоквиз",
        tagline: "Страны, столицы и природные рекорды",
        image_url: "https://imgcdn.corsme.com/2025/12/30/f8bbcd97-0103-4e11-8ab4-92698bf25570.jpg",
        description: "Проверьте свои знания географии: столицы, океаны, горы, озёра и знаменитые места планеты. Вопросы средней сложности — от простых фактов до небольших географических загадок.»",
        category: "география",
        difficulty: "Medium",
        duration: 20,
        is_popular: true,
    }

const quiz2 = 
    {
        slug: "literature",
        title: "Литературный квиз",
        tagline: "Книги, авторы и великие романы",
        description: "Проверьте, насколько хорошо вы знаете мировую литературу: классические романы, знаменитых авторов, культовых персонажей и крылатые фразы. Вопросы средней сложности — для тех, кто любит читать и помнит не только сюжет, но и детали.»",
        image_url: "https://i.pinimg.com/originals/9f/74/70/9f747060794d350b5704dac61f89bdff.png",
        category: "литература",
        difficulty: "Medium",
        duration: 20,
        is_popular: true,
        is_new: true,
    }

const quiz3 = 
    {
        slug: "new-year",
        title: "Новогодний квиз",
        tagline: "Традиции, символы и праздничное настроение",
        description: "Проверьте, насколько хорошо вы знаете новогодние традиции разных стран, историю праздника и его символы. Вопросы средней сложности — от Деда Мороза и оливье до забавных обычаев со всего мира.»",
        image_url: "https://cs12.pikabu.ru/post_img/big/2022/12/29/2/167227456316595157.jpg",
        category: "новый год",
        difficulty: "Medium",
        duration: 20,
        is_new: true,
    }

const questions = [
    {
        question: "Какая страна является самой большой по площади?",
        options: ["Канада", "Китай", "Россия", "США"],
        answer_id: 2,
        is_sample: true
    },
    {
        question: "Какой город является столицей Канады?",
        options: ["Торонто", "Ванкувер", "Оттава", "Монреаль"],
        answer_id: 2,
        is_sample: true
    },
    {
        question: "Какой океан самый большой по площади?",
        options: ["Атлантический", "Индийский", "Северный Ледовитый", "Тихий"],
        answer_id: 3,
        is_sample: false
    },
    {
        question: "В какой стране находится Эйфелева башня?",
        options: ["Италия", "Франция", "Испания", "Бельгия"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какая гора является самой высокой в мире?",
        options: ["К2", "Эверест", "Канченджанга", "Лхоцзе"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какое море не имеет берегов?",
        options: ["Мёртвое", "Саргассово", "Красное", "Чёрное"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какой город является столицей Австралии?",
        options: ["Сидней", "Мельбурн", "Канберра", "Брисбен"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Какое озеро является самым глубоким в мире?",
        options: ["Танганьика", "Байкал", "Верхнее", "Виктория"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какой материк является самым маленьким?",
        options: ["Австралия", "Европа", "Антарктида", "Южная Америка"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "В какой стране находится древний город Мачу-Пикчу?",
        options: ["Чили", "Перу", "Боливия", "Эквадор"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какой пролив разделяет Азию и Северную Америку?",
        options: ["Гибралтарский", "Берингов", "Магелланов", "Дрейка"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какая горная система является самой длинной на суше?",
        options: ["Гималаи", "Анды", "Скалистые горы", "Атлас"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какой город является столицей Бразилии?",
        options: ["Рио-де-Жанейро", "Сан-Паулу", "Бразилиа", "Салвадор"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Какое озеро является самым большим по площади?",
        options: ["Байкал", "Каспийское", "Верхнее", "Танганьика"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "В какой стране находится вулкан Фудзияма?",
        options: ["Китай", "Япония", "Южная Корея", "Филиппины"],
        answer_id: 1,
        is_sample: false
    }
]

const questions2 = [
    {
        question: "Кто написал роман «Мастер и Маргарита»?",
        options: ["Борис Пастернак", "Михаил Булгаков", "Владимир Набоков", "Максим Горький"],
        answer_id: 1,
        is_sample: true
    },
    {
        question: "В какой стране происходит действие романа «Гордость и предубеждение»?",
        options: ["Франция", "Италия", "Англия", "Шотландия"],
        answer_id: 2,
        is_sample: true
    },
    {
        question: "Кто автор романа «Преступление и наказание»?",
        options: ["Лев Толстой", "Антон Чехов", "Иван Тургенев", "Фёдор Достоевский"],
        answer_id: 3,
        is_sample: false
    },
    {
        question: "Как зовут главного героя романа «Над пропастью во ржи»?",
        options: ["Холден Колфилд", "Джей Гэтсби", "Ральф", "Джордж Милтон"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Кто написал роман «1984»?",
        options: ["Олдос Хаксли", "Рэй Брэдбери", "Джордж Оруэлл", "Евгений Замятин"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Как зовут слугу д’Артаньяна в романе «Три мушкетёра»?",
        options: ["Гримо", "Базен", "Мушкетон", "Планше"],
        answer_id: 3,
        is_sample: false
    },
    {
        question: "Кто автор романа «Дюна»?",
        options: ["Айзек Азимов", "Фрэнк Герберт", "Артур Кларк", "Филип Дик"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Как называется первая книга о Гарри Поттере?",
        options: ["Гарри Поттер и Тайная комната", "Гарри Поттер и Узник Азкабана", "Гарри Поттер и философский камень", "Гарри Поттер и Кубок огня"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Кто написал роман «Убить пересмешника»?",
        options: ["Харпер Ли", "Трумен Капоте", "Джон Стейнбек", "Уильям Фолкнер"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Кто понёс Кольцо в Мордор в «Властелине колец»?",
        options: ["Сэм", "Мерри", "Пиппин", "Фродо"],
        answer_id: 3,
        is_sample: false
    },
    {
        question: "Кто автор повести «Маленький принц»?",
        options: ["Антуан де Сент-Экзюпери", "Альбер Камю", "Виктор Гюго", "Жюль Верн"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Как зовут главную героиню романа «Джейн Эйр»?",
        options: ["Элизабет Беннет", "Джейн Эйр", "Кэтрин Эрншо", "Эмма Вудхаус"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Кто написал повесть «Старик и море»?",
        options: ["Эрнест Хемингуэй", "Фрэнсис Скотт Фицджеральд", "Марк Твен", "Джек Лондон"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "В какой роман входит фраза «Все счастливые семьи похожи друг на друга…»?",
        options: ["«Анна Каренина»", "«Война и мир»", "«Отцы и дети»", "«Обломов»"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Кто автор романа «451 градус по Фаренгейту»?",
        options: ["Джордж Оруэлл", "Рэй Брэдбери", "Курт Воннегут", "Станислав Лем"],
        answer_id: 1,
        is_sample: false
    }
]

const questions3 = [
    {
        question: "В какой стране существует традиция съедать 12 виноградин под бой часов на Новый год?",
        options: ["Италия", "Испания", "Мексика", "Греция"],
        answer_id: 1,
        is_sample: true
    },
    {
        question: "Кто написал слова к песне «В лесу родилась ёлочка»?",
        options: ["Агния Барто", "Раиса Кудашева", "Корней Чуковский", "Самуил Маршак"],
        answer_id: 1,
        is_sample: true
    },
    {
        question: "Какой фильм в России традиционно смотрят в новогоднюю ночь?",
        options: ["«Иван Васильевич меняет профессию»", "«Ирония судьбы, или С лёгким паром!»", "«Москва слезам не верит»", "«Служебный роман»"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "В какой стране на Новый год принято бить тарелки о двери друзей?",
        options: ["Швеция", "Норвегия", "Дания", "Финляндия"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Как называется традиционный российский новогодний салат?",
        options: ["Винегрет", "Оливье", "Мимоза", "Сельдь под шубой"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Кто является внучкой Деда Мороза?",
        options: ["Василиса Премудрая", "Снегурочка", "Марья-искусница", "Алёнушка"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "В какой стране Новый год по традиции встречают не 1 января, а по лунному календарю?",
        options: ["Япония", "Китай", "Индия", "Корея"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какой город в России считается родиной Деда Мороза?",
        options: ["Вологда", "Великий Устюг", "Кострома", "Суздаль"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Какая песня считается самой известной новогодней песней в мире?",
        options: ["Jingle Bells", "Silent Night", "Happy New Year", "Let It Snow"],
        answer_id: 0,
        is_sample: false
    },
    {
        question: "Что традиционно дарят на Новый год в Японии?",
        options: ["Цветы", "Деньги в конвертах", "Сладости", "Игрушки"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "В какой стране новогоднего волшебника зовут Йоулупукки?",
        options: ["Швеция", "Норвегия", "Финляндия", "Дания"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "В какой стране на Новый год принято выбрасывать старую мебель из окон?",
        options: ["Испания", "Италия", "Греция", "Португалия"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Сколько животных в восточном календаре?",
        options: ["10", "12", "14", "16"],
        answer_id: 1,
        is_sample: false
    },
    {
        question: "Как зовут новогоднего волшебника в Германии?",
        options: ["Санта-Клаус", "Пер-Ноэль", "Вайнахтсман", "Баббо Натале"],
        answer_id: 2,
        is_sample: false
    },
    {
        question: "Как называется шотландская новогодняя традиция, когда первый гость приносит удачу?",
        options: ["Хогманай", "Фёрст-футинг", "Кэллан", "Самин"],
        answer_id: 1,
        is_sample: false
    }
]


async function main() {
    console.log("Seeding quiz...")
    await prisma.quiz.create({
        data: quiz,
    })
    await prisma.quiz.create({
        data: quiz2,
    })
    await prisma.quiz.create({
        data: quiz3,
    })
    for (const question of questions) {
        await prisma.question.create({
            data:{
                quizId: 5,
                question: question.question,
                options: {create: question.options.map((option) => ({ option }))},
                answer_id: question.answer_id,
                is_sample: question.is_sample
            }
        });
    }
    for (const question of questions2) {
        await prisma.question.create({
            data:{
                quizId: 6,
                question: question.question,
                options: {create: question.options.map((option) => ({ option }))},
                answer_id: question.answer_id,
                is_sample: question.is_sample
            }
        });
    }
    for (const question of questions3) {
        await prisma.question.create({
            data:{
                quizId: 7,
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