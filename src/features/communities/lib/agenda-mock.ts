export interface AgendaEventFlat {
    id: string;
    communityId: string;
    communityName: string;
    communityEmoji: string;
    title: string;
    description: string;
    type: "online" | "presencial";
    date: Date;
    time: string;
    duration: string;
    host: string;
    hostId: string;
    location?: string;
    link?: string;
    rsvpCount: number;
    rsvpdByDefault: boolean;
}

export const FLAT_AGENDA: AgendaEventFlat[] = [
    // ── comm_01: Psicologia & UX ─────────────────────────────────────────────
    {
        id: "ev_01a", communityId: "comm_01", communityName: "Psicologia & UX", communityEmoji: "🧠",
        title: "Workshop: Gatilhos Cognitivos no Design",
        description: "Estudo guiado sobre o livro 'Hooked' com discussão prática de como aplicar ética nos padrões de engajamento.",
        type: "online", date: new Date(Date.now() + 2 * 86400000), time: "19:00", duration: "2h",
        host: "Felipe Designer", hostId: "user_1", link: "#", rsvpCount: 11, rsvpdByDefault: false,
    },
    {
        id: "ev_01b", communityId: "comm_01", communityName: "Psicologia & UX", communityEmoji: "🧠",
        title: "Café & UX — Encontro Presencial",
        description: "Bate-papo sobre tendências de UX Research. Vamos tomar um café e trocar experiências.",
        type: "presencial", date: new Date(Date.now() + 8 * 86400000), time: "10:00", duration: "3h",
        host: "Sarah Chen", hostId: "user_3", location: "WeWork Faria Lima · Sala 203", rsvpCount: 7, rsvpdByDefault: true,
    },
    {
        id: "ev_01c", communityId: "comm_01", communityName: "Psicologia & UX", communityEmoji: "🧠",
        title: "Pesquisa Qualitativa ao Vivo",
        description: "Sessão de user testing aberta — acompanhe ao vivo e dê feedback em tempo real.",
        type: "online", date: new Date(Date.now() - 3 * 86400000), time: "15:00", duration: "1h30",
        host: "Carla Mendes", hostId: "user_5", link: "#", rsvpCount: 18, rsvpdByDefault: true,
    },
    // ── comm_02: RPG & Jogos de Mesa ─────────────────────────────────────────
    {
        id: "ev_02a", communityId: "comm_02", communityName: "RPG & Jogos de Mesa", communityEmoji: "🎲",
        title: "One-Shot D&D 5e — A Caverna Esquecida",
        description: "Aventura de one-shot para 4 jogadores. Sistema 5e, personagens pré-prontos disponíveis. Iniciantes bem-vindos!",
        type: "online", date: new Date(Date.now() + 1 * 86400000), time: "20:00", duration: "3h",
        host: "Alex Rivera", hostId: "user_2", link: "#", rsvpCount: 4, rsvpdByDefault: false,
    },
    {
        id: "ev_02b", communityId: "comm_02", communityName: "RPG & Jogos de Mesa", communityEmoji: "🎲",
        title: "Board Game Night — Presencial",
        description: "Noite de jogos de mesa no escritório. Levaremos Wingspan, Terraforming Mars e mais. BYOB 🍺",
        type: "presencial", date: new Date(Date.now() + 14 * 86400000), time: "18:30", duration: "4h",
        host: "Alex Rivera", hostId: "user_2", location: "Escritório Principal · Sala Gamma", rsvpCount: 12, rsvpdByDefault: true,
    },
    // ── comm_03: Clube do Livro ──────────────────────────────────────────────
    {
        id: "ev_03a", communityId: "comm_03", communityName: "Clube do Livro", communityEmoji: "📚",
        title: "Discussão: 'Sapiens' — Capítulos 8-12",
        description: "Continuação da leitura mensal. Não deixe para última hora — os capítulos são ricos!",
        type: "online", date: new Date(Date.now() + 5 * 86400000), time: "20:00", duration: "1h30",
        host: "Felipe Designer", hostId: "user_1", link: "#", rsvpCount: 14, rsvpdByDefault: false,
    },
    // ── comm_04: Fitness & Saúde ─────────────────────────────────────────────
    {
        id: "ev_04a", communityId: "comm_04", communityName: "Fitness & Saúde", communityEmoji: "💪",
        title: "Corrida em Grupo — Parque Ibirapuera",
        description: "5km tranquilos para todos os níveis. Ponto de encontro: entrada da Portaria 3.",
        type: "presencial", date: new Date(Date.now() + 3 * 86400000), time: "07:00", duration: "1h",
        host: "Sarah Chen", hostId: "user_3", location: "Parque Ibirapuera · Portaria 3", rsvpCount: 9, rsvpdByDefault: true,
    },
    {
        id: "ev_04b", communityId: "comm_04", communityName: "Fitness & Saúde", communityEmoji: "💪",
        title: "Meditação Guiada Online",
        description: "20 minutos de meditação guiada para começar a semana bem. Nenhum equipamento necessário.",
        type: "online", date: new Date(Date.now() + 6 * 86400000), time: "08:00", duration: "30min",
        host: "Carla Mendes", hostId: "user_5", link: "#", rsvpCount: 22, rsvpdByDefault: false,
    },
];
