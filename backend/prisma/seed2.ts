import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})




async function main() {
  console.log("Seeding quiz...")
    await prisma.question.updateMany({
        where:{
            id: {
                gte:11,
                lte:20
            }

        },
        data: {
            quizId: 2
        }
    })
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