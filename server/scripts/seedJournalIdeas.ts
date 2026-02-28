import { prismaClient } from '../src/services/prismaClient/index';
import { createJournalEmbedding } from '../src/services/openai/journalEmbedding';

const userId = 'user_39kqeIOaHbfE0ECuPCV6GYk2432';

const entries = [
    { topic: 'Conflict în relație și împăcare', emotion: 'sadness', distortion: 'all-or-nothing thinking', risk: 6, content: 'Aseară ne-am certat din nou pe lucruri mici și m-am simțit neînțeles. Dimineață am ales să vorbesc calm, fără reproșuri, și i-am spus ce simt clar. Discuția a fost mai bună și am simțit că ne-am apropiat puțin.' },
    { topic: 'Zi bună la muncă', emotion: 'joy', distortion: null, risk: 2, content: 'Am avut o zi foarte bună la birou și am terminat taskurile la timp. Colegii m-au ajutat, iar feedbackul primit a fost pozitiv. M-am simțit util și motivat.' },
    { topic: 'Anxietate înainte de prezentare', emotion: 'fear', distortion: 'catastrophizing', risk: 7, content: 'Înainte de prezentare mi-a fost teamă că o să mă blochez. Am respirat adânc timp de câteva minute și am repetat ideile principale. Până la final m-am descurcat mai bine decât mă așteptam.' },
    { topic: 'Oboseală și lipsă de chef', emotion: 'sadness', distortion: 'mental filter', risk: 5, content: 'M-am trezit fără energie și totul mi s-a părut greu. Nu am avut chef de nimic și m-am criticat pentru productivitatea mică. Seara am făcut o plimbare scurtă și m-am liniștit puțin.' },
    { topic: 'Mândrie după antrenament', emotion: 'joy', distortion: null, risk: 2, content: 'Am mers la sală deși nu aveam chef. După antrenament m-am simțit mult mai bine și am avut claritate mentală. Sunt mândru că m-am ținut de program.' },
    { topic: 'Îngrijorare financiară', emotion: 'fear', distortion: 'fortune telling', risk: 6, content: 'Cheltuielile din luna asta m-au stresat și m-am gândit că nu o să mă descurc. Mi-am făcut buget pe categorii și am tăiat câteva costuri inutile. Faptul că am un plan m-a calmat.' },
    { topic: 'Weekend liniștit cu familia', emotion: 'joy', distortion: null, risk: 1, content: 'Am petrecut timp cu familia și am râs mult la masă. M-am simțit în siguranță și conectat. A fost una dintre cele mai liniștite zile din ultima perioadă.' },
    { topic: 'Frustrare în trafic', emotion: 'anger', distortion: 'should statements', risk: 4, content: 'Am stat blocat în trafic și m-am enervat repede. Mă gândeam că lucrurile ar trebui să meargă perfect și asta m-a agitat. După ce am pus muzică și am acceptat situația, m-am mai calmat.' },
    { topic: 'Noapte proastă, somn puțin', emotion: 'sadness', distortion: 'magnification', risk: 5, content: 'Am dormit foarte puțin și toată ziua m-am simțit iritat. Mi se părea că orice problemă e mai mare decât este de fapt. Diseară vreau să intru mai devreme la somn.' },
    { topic: 'Reușită mică la proiect personal', emotion: 'joy', distortion: null, risk: 2, content: 'Am făcut un progres mic la proiectul meu personal. Nu e spectaculos, dar e constant și asta mă bucură. Simt că avansez pas cu pas.' },
    { topic: 'Gânduri negative despre viitor', emotion: 'fear', distortion: 'catastrophizing', risk: 7, content: 'Astăzi m-am gândit mult la viitor și am intrat într-o spirală de scenarii rele. Mi-a fost greu să mă opresc din ruminație. M-a ajutat să scriu concret ce pot controla acum.' },
    { topic: 'Recunoștință seara', emotion: 'joy', distortion: null, risk: 1, content: 'Seara am notat trei lucruri bune din ziua mea. Exercițiul de recunoștință m-a făcut să văd și partea bună a lucrurilor. M-am culcat mai liniștit.' },
    { topic: 'Tensiune cu un prieten', emotion: 'anger', distortion: 'mind reading', risk: 5, content: 'Am simțit că un prieten m-a ignorat și m-am supărat. Mi-am dat seama că am presupus intenții fără să clarific. După ce am vorbit direct, s-a rezolvat mai simplu decât credeam.' },
    { topic: 'Calm după meditație', emotion: 'neutral', distortion: null, risk: 2, content: 'Am făcut 10 minute de meditație dimineața. Nu am avut o zi perfectă, dar am rămas mai stabil emoțional. Reacțiile mele au fost mai puțin impulsive.' },
    { topic: 'Dor de conexiune', emotion: 'sadness', distortion: 'emotional reasoning', risk: 6, content: 'M-am simțit singur în seara asta și am simțit un gol puternic. Mi s-a părut că dacă mă simt așa, înseamnă că sunt blocat. După ce am vorbit cu cineva apropiat, senzația s-a redus.' },
    { topic: 'Curaj să pun limite', emotion: 'joy', distortion: null, risk: 2, content: 'Astăzi am spus nu la ceva ce mă consuma. A fost greu pe moment, dar apoi m-am simțit respectat și împăcat. Limitele clare îmi fac bine.' },
    { topic: 'Stres înainte de evaluare', emotion: 'fear', distortion: 'fortune telling', risk: 6, content: 'Înainte de evaluare am simțit nod în stomac și am anticipat doar ce e rău. M-am pregătit cu exemple concrete și am intrat mai încrezător. Rezultatul a fost mai bun decât îmi imaginam.' },
    { topic: 'Iritare după feedback dur', emotion: 'anger', distortion: 'personalization', risk: 5, content: 'Am primit un feedback dur și m-am simțit atacat personal. Inițial m-am enervat, apoi am separat tonul de informația utilă. Asta m-a ajutat să iau doar ce e constructiv.' },
    { topic: 'Bucurie după ieșire în natură', emotion: 'joy', distortion: null, risk: 1, content: 'Am mers într-un parc și am stat departe de telefon o oră. Aerul curat și mersul m-au ajutat să-mi limpezesc mintea. M-am simțit cu adevărat bine.' },
    { topic: 'Echilibru după o zi mixtă', emotion: 'neutral', distortion: null, risk: 3, content: 'Ziua a avut și momente bune, și momente tensionate. Nu a fost nici excelentă, nici rea, dar am gestionat-o decent. Mă simt mai echilibrat decât ieri.' },
] as const;

async function main() {
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found: ' + userId);

    const created: Array<{ topic: string; journalEntryId: string; emotion: string; riskScore: number | null }> = [];

    for (const item of entries) {
        const embedding = await createJournalEmbedding(item.content);

        const journalEntry = await prismaClient.journalEntry.create({
            data: {
                userId,
                content: item.content,
                status: 'submitted',
                embedding,
            },
        });

        const analysis = await prismaClient.emotionalAnalysis.create({
            data: {
                journalEntryId: journalEntry.id,
                dominantEmotion: item.emotion,
                cognitiveDistortion: item.distortion,
                riskScore: item.risk,
            },
        });

        created.push({
            topic: item.topic,
            journalEntryId: journalEntry.id,
            emotion: analysis.dominantEmotion,
            riskScore: analysis.riskScore,
        });
    }

    console.log(JSON.stringify({ createdCount: created.length, created }, null, 2));
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
