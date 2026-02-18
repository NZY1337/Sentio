import { prismaClient } from "../services/prismaClient";

async function generateMockData() {
    // 1. Crează utilizatori
    const users = [];
    for (let i = 1; i <= 5; i++) {
        const p = await prismaClient.user.create({
            data: {
                id: `user-${i}`,
                username: `Utilizator ${i}`,
                email: `utilizator${i}@test.com`,
                consent: true,
            },
        });
        users.push(p);
    }

    // 2. Crează jurnale și analize
    for (const user of users) {
        for (let j = 1; j <= 3; j++) {
            const journal = await prismaClient.journalEntry.create({
                data: {
                    userId: user.id,
                    content: `Acesta este jurnalul #${j} al ${user.username}`,
                    embedding: Array(1536).fill(0).map(() => Math.random()), // vector random
                },
            });

            // 3. Crează analiza emoțională mock
            await prismaClient.emotionalAnalysis.create({
                data: {
                    journalEntryId: journal.id,
                    dominantEmotion: ["fericire", "tristețe", "anxietate"][Math.floor(Math.random() * 3)],
                    cognitiveDistortion: ["catastrofizare", "personalizare", "generalizare"][Math.floor(Math.random() * 3)],
                    riskScore: Math.floor(Math.random() * 101),
                },
            });

            // 4. Optional: creare alertă dacă risc > 80
            const riskScore = Math.floor(Math.random() * 101);
            if (riskScore > 80) {
                await prismaClient.alert.create({
                    data: {
                        userId: user.id,
                        message: "Risc ridicat detectat",
                        level: "critical",
                    },
                });
            }
        }
    }

    console.log("Mock data created!");
}

generateMockData().finally(() => prismaClient.$disconnect());
