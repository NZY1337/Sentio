import { prismaClient } from "../src/services/prismaClient/index";

const normalize = (text: string) => (text || "").toLowerCase().replace(/\s+/g, " ").trim();

async function main() {
    const applyChanges = process.argv.includes("--apply");

    const rows = await prismaClient.journalEntry.findMany({
        select: { id: true, userId: true, content: true, createdAt: true },
        orderBy: [{ userId: "asc" }, { createdAt: "desc" }],
        take: 5000,
    });

    const groups = new Map<string, Array<{ id: string; userId: string; createdAt: Date }>>();

    for (const row of rows) {
        const normalizedContent = normalize(row.content);
        if (!normalizedContent) continue;

        const key = `${row.userId}::${normalizedContent}`;
        const current = groups.get(key) ?? [];
        current.push({ id: row.id, userId: row.userId, createdAt: row.createdAt });
        groups.set(key, current);
    }

    const duplicateGroups = [...groups.values()]
        .filter((group) => group.length > 1)
        .map((group) => group.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));

    const idsToDelete = duplicateGroups.flatMap((group) => group.slice(1).map((entry) => entry.id));

    console.log("total rows checked:", rows.length);
    console.log("duplicate groups:", duplicateGroups.length);
    console.log("entries to delete:", idsToDelete.length);

    if (!applyChanges) {
        console.log("\nDry run only. Re-run with --apply to delete duplicates.");
        return;
    }

    if (!idsToDelete.length) {
        console.log("No duplicate rows to delete.");
        return;
    }

    const deleteAnalysis = await prismaClient.emotionalAnalysis.deleteMany({
        where: { journalEntryId: { in: idsToDelete } },
    });

    const deleteJournals = await prismaClient.journalEntry.deleteMany({
        where: { id: { in: idsToDelete } },
    });

    console.log("Deleted emotionalAnalysis rows:", deleteAnalysis.count);
    console.log("Deleted journalEntry rows:", deleteJournals.count);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
