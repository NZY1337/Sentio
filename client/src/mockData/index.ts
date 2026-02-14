// src/mocks/mockData.ts
export const mockUsers = [
  {
    id: "1",
    username: "Pacient 1",
    email: "pacient1@test.com",
    consent: true,
    journals: [
      {
        id: "j1",
        content: "Am fost foarte obosit azi și stresat la muncă.",
        createdAt: "2026-02-14",
        analysis: {
          dominantEmotion: "anxietate",
          cognitiveDistortion: "catastrofizare",
          riskScore: 85,
        },
      },
      {
        id: "j2",
        content: "M-am simțit liniștit după plimbare.",
        createdAt: "2026-02-13",
        analysis: {
          dominantEmotion: "fericire",
          cognitiveDistortion: "none",
          riskScore: 20,
        },
      },
    ],
    alerts: [
      { id: "a1", message: "Risc ridicat detectat", level: "critical" },
    ],
  },
  {
    id: "2",
    name: "Pacient 2",
    email: "pacient2@test.com",
    consent: true,
    journals: [
      {
        id: "j3",
        content: "Am simțit tristețe toată ziua.",
        createdAt: "2026-02-14",
        analysis: {
          dominantEmotion: "tristețe",
          cognitiveDistortion: "personalizare",
          riskScore: 60,
        },
      },
    ],
    alerts: [],
  },
];
