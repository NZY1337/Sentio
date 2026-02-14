┌───────────────────┐
│   Pacient (User)  │
└───────────────────┘
          │
          ▼
┌───────────────────────────┐
│ Scrie jurnal / log gânduri│
└───────────────────────────┘
          │
          ▼
┌───────────────────────────┐
│ Salvează JournalEntry în  │
│ baza de date (DB)         │
└───────────────────────────┘
          │
          ▼
┌───────────────────────────┐
│ Pacient apasă "Trimite  │
│ pentru analiză AI"      │
└───────────────────────────┘
          │
          ▼
┌───────────────────────────┐
│ AI (GPT-4 / embeddings + │
│ RAG context) analizează  │
│ jurnalul:                 │
│ - dominantEmotion         │
│ - cognitiveDistortion     │
│ - riskScore               │
└───────────────────────────┘
          │
          ▼
┌───────────────────────────┐
│ Salvează rezultatul în    │
│ EmotionalAnalysis (DB)    │
└───────────────────────────┘
          │
          ▼
┌───────────────────────────┐
│ Dacă riskScore > threshold│
│ => creează Alert în DB    │
└───────────────────────────┘
          │
          ▼
┌───────────────────┐           ┌─────────────────────┐
│ Pacient vede      │◄──────────│ Dashboard / UI      │
│ raport vizual:    │           │ psiholog           │
│ - Emoții dominante│           │ - Toate jurnalele   │
│ - Scor risc       │           │ - Analize emoționale│
│ - Tipare negative │           │ - Alerte           │
└───────────────────┘           └─────────────────────┘
          │
          ▼
┌───────────────────┐
│ Pacient + Psiholog│
│ interacționează   │
│ discuții / ședințe│
└───────────────────┘
          │
          ▼
┌───────────────────┐
│ Zile următoare:   │
│ repetare flow     │
└───────────────────┘
