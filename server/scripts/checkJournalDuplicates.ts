import { prismaClient } from "../src/services/prismaClient/index";

const normalize = (text: string) =>
    (text || "").toLowerCase().replace(/\s+/g, " ").trim();

async function main() {
    const rows = await prismaClient.journalEntry.findMany({
        select: { id: true, userId: true, createdAt: true, content: true },
        orderBy: { createdAt: "desc" },
        take: 1000,
    });

    const grouped = new Map<string, Array<{ id: string; userId: string; createdAt: Date }>>();

    for (const row of rows) {
        const key = normalize(row.content);
        if (!key) continue;
        const arr = grouped.get(key) ?? [];
        arr.push({ id: row.id, userId: row.userId, createdAt: row.createdAt });
        grouped.set(key, arr);
    }

    const duplicates = [...grouped.entries()]
        .filter(([, arr]) => arr.length > 1)
        .sort((a, b) => b[1].length - a[1].length);

    console.log("total rows checked:", rows.length);
    console.log("duplicate content groups:", duplicates.length);

    for (const [content, arr] of duplicates.slice(0, 20)) {
        console.log("\ncount=", arr.length, "sample=", content.slice(0, 180));
        for (const item of arr.slice(0, 6)) {
            console.log(" -", item.id, item.userId, item.createdAt.toISOString());
        }
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
