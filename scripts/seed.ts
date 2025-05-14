import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Mathematics" },
                { name: "Physics" },
                { name: "Chemistry" },
                { name: "Biology" },

            ]
        })
        console.log("Categories seeded successfully.");

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await database.$disconnect();
    }
}

main();