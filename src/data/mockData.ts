// ─── Types ────────────────────────────────────────────────────────────────────

export type ClientStatus = 'aktivní' | 'bývalý' | 'neklient';

export interface Client {
  type: 'standard';
  status: ClientStatus;
  name: string;
  rodneČíslo: string;
  telefon: string;
  email: string;
  adresa: string;
  čísloKlienta: string;
  telVerified: boolean;
  emailVerified: boolean;
}

export interface CompanyClient {
  type: 'company';
  status: ClientStatus;
  name: string;
  ičo: string;
  telefon: string;
  email: string;
  adresa: string;
  čísloKlienta: string;
  kontaktníOsoba: string;
  roleKontaktu: string;
  telVerified: boolean;
  emailVerified: boolean;
}

export interface BrokerClientInfo {
  type: 'broker';
  status: ClientStatus;
  name: string;
  čísloBrokera: string;
  telefon: string;
  email: string;
  adresa: string;
  telVerified: boolean;
  emailVerified: boolean;
}

export interface Product {
  name: string;
  description: string;
  contractNumber?: string;
  status: 'aktivní' | 'neaktivní';
  výročí: string;
  platba: 'zaplaceno' | 'nezaplaceno' | 'vypršelo';
  limitPlnění?: string;
  spoluÚčast?: string;
}

export interface BrokerProduct extends Product {
  clientName: string;
  clientNumber: string;
}

export interface Interaction {
  type: 'hovor' | 'email' | 'web';
  date: string;
  relativeDate?: string;
  description: string;
  icon: string;
}

export interface Ticket {
  id: string;
  source: 'Email' | 'Telefon' | 'Web';
  description: string;
  age: string;
}

export interface Claim {
  id: string;
  type: string;
  icon: string;
  risk: string;
  status: 'aktivní' | 'neaktivní' | 'zamítnutá';
  limitPlnění?: string;
  spoluÚčast?: string;
}

export interface Calculation {
  product: string;
  detail?: string;
  price?: string;
  date: string;
  solver?: string;
  isCurrent: boolean;
}

export interface Hint {
  id: string;
  title: string;
  subtitle: string;
  category: 'compliance' | 'objection' | 'product' | 'info';
  detail: string;
  script: string;
  appearsAt: number;
}

export interface Skill {
  id: string;
  name: string;
  inboundQueues: string[];
  outboundQueues: string[];
  maxRetry: number;
}

export interface Operator {
  id: string;
  name: string;
  team: 'KC' | 'KAPU' | 'Poradci';
  skills: Record<string, number>;
}

// ─── Standard Client (Jana Nováková) ─────────────────────────────────────────

export const client: Client = {
  type: 'standard',
  status: 'aktivní',
  name: 'Jana Nováková',
  rodneČíslo: '845612/1234',
  telefon: '+420 602 345 678',
  email: 'jana.novakova@email.cz',
  adresa: 'Vinohradská 42, Praha 2, 120 00',
  čísloKlienta: 'KL-2024-00891',
  telVerified: true,
  emailVerified: true,
};

export const products: Product[] = [
  {
    name: 'Vozidla',
    description: 'Havarijní pojištění · Škoda Octavia 4A2 3456',
    contractNumber: 'SML-2024-4820',
    status: 'aktivní',
    výročí: '15. 3. 2026',
    platba: 'zaplaceno',
    limitPlnění: '500 000 Kč',
    spoluÚčast: '10 000 Kč',
  },
  {
    name: 'Vozidla',
    description: 'Povinné ručení · Škoda Octavia 4A2 3456',
    contractNumber: 'SML-2024-4821',
    status: 'aktivní',
    výročí: '15. 3. 2026',
    platba: 'zaplaceno',
    limitPlnění: '35 000 000 Kč',
    spoluÚčast: '0 Kč',
  },
  {
    name: 'Mazlíčci',
    description: 'Pojištění psa · Jack Russell Terrier, Rexík',
    contractNumber: 'SML-2023-2190',
    status: 'aktivní',
    výročí: '8. 9. 2026',
    platba: 'nezaplaceno',
    limitPlnění: '30 000 Kč',
    spoluÚčast: '500 Kč',
  },
  {
    name: 'Cestovní',
    description: 'Rodinné cestovní pojištění · Schengen + mimo EU',
    contractNumber: 'SML-2022-0891',
    status: 'neaktivní',
    výročí: '1. 6. 2025',
    platba: 'vypršelo',
    limitPlnění: '5 000 000 Kč',
    spoluÚčast: '0 Kč',
  },
  {
    name: 'Majetek',
    description: 'Pojištění domácnosti · Vinohradská 42, Praha 2',
    contractNumber: 'SML-2021-1120',
    status: 'neaktivní',
    výročí: '10. 1. 2025',
    platba: 'vypršelo',
    limitPlnění: '800 000 Kč',
    spoluÚčast: '1 000 Kč',
  },
];

export const interactions: Interaction[] = [
  {
    type: 'email',
    date: '5. 3. 2026',
    relativeDate: '35 dní',
    description: 'Reklamace vyúčtování HAV · IPEX-2025-0042',
    icon: '📧',
  },
  {
    type: 'hovor',
    date: '12. 1. 2026',
    relativeDate: '87 dní',
    description: 'Hlášení škody na vozidle · PU-2026-0001 otevřeno',
    icon: '📞',
  },
  {
    type: 'web',
    date: '15. 12. 2025',
    description: 'Kalkulace cestovního pojištění (webová kalkulačka)',
    icon: '🌐',
  },
  {
    type: 'hovor',
    date: '1. 12. 2025',
    description: 'Obnova POV na rok 2026 · platba přijata',
    icon: '📞',
  },
  {
    type: 'email',
    date: '15. 11. 2025',
    description: 'Obnova smlouvy HAV č. 4820-2025 · potvrzení',
    icon: '📧',
  },
  {
    type: 'web',
    date: '2. 11. 2025',
    description: 'Stažení zelené karty POV (PDF)',
    icon: '🌐',
  },
  {
    type: 'hovor',
    date: '10. 10. 2025',
    description: 'Dotaz na asistenční služby v rámci HAV krytí',
    icon: '📞',
  },
  {
    type: 'email',
    date: '5. 9. 2025',
    description: 'Změna korespondenční adresy · potvrzeno',
    icon: '📧',
  },
];

export const tickets: Ticket[] = [
  { id: 'IPEX-2025-0042', source: 'Email', description: 'Reklamace vyúčtování HAV · únor 2026', age: '3 dny' },
  { id: 'IPEX-2025-0038', source: 'Telefon', description: 'Hlášení škody na vozidle · PU-2026-0001', age: '5 dnů' },
];

export const claims: Claim[] = [
  {
    id: 'PU-2026-0051',
    type: 'Škoda na vozidle',
    icon: '🚗',
    risk: 'Havarijní pojištění',
    status: 'aktivní',
    limitPlnění: '500 000 Kč',
    spoluÚčast: '10 000 Kč',
  },
  {
    id: 'PU-2025-0312',
    type: 'Škoda na vozidle',
    icon: '🚗',
    risk: 'Povinné ručení',
    status: 'neaktivní',
  },
  {
    id: 'PU-2024-0089',
    type: 'Škoda na majetku',
    icon: '🏠',
    risk: 'Pojištění domácnosti',
    status: 'zamítnutá',
  },
];

export const calculations: Calculation[] = [
  {
    product: 'Cestovní',
    detail: 'Rodinné pojištění · Schengen + mimo EU',
    price: '3 800 Kč/rok',
    date: '9. 4. 2026',
    isCurrent: true,
  },
  {
    product: 'Majetek',
    date: '15. 2. 2026',
    solver: 'Petr Svoboda',
    isCurrent: false,
  },
  {
    product: 'Mazlíčci',
    date: '3. 1. 2026',
    solver: 'Lucie Černá',
    isCurrent: false,
  },
];

// ─── Company Client (ABC Logistika s.r.o.) ────────────────────────────────────

export const companyClient: CompanyClient = {
  type: 'company',
  status: 'aktivní',
  name: 'ABC Logistika s.r.o.',
  ičo: '28452890',
  telefon: '+420 234 567 890',
  email: 'pojisteni@abclogistika.cz',
  adresa: 'Průmyslová 12, Praha 9, 190 00',
  čísloKlienta: 'KL-F-2020-00042',
  kontaktníOsoba: 'Mgr. Tomáš Beneš',
  roleKontaktu: 'Jednatel',
  telVerified: true,
  emailVerified: true,
};

export const companyProducts: Product[] = [
  {
    name: 'Flotila',
    description: 'Havarijní pojištění · 20 vozidel (MAN, Scania, Ford)',
    contractNumber: 'SML-F-2023-0112',
    status: 'aktivní',
    výročí: '1. 1. 2027',
    platba: 'zaplaceno',
    limitPlnění: '5 000 000 Kč',
    spoluÚčast: '10 000 Kč',
  },
  {
    name: 'Flotila',
    description: 'Povinné ručení · 20 vozidel',
    contractNumber: 'SML-F-2023-0113',
    status: 'aktivní',
    výročí: '1. 1. 2027',
    platba: 'zaplaceno',
    limitPlnění: '35 000 000 Kč',
    spoluÚčast: '0 Kč',
  },
  {
    name: 'Budovy',
    description: 'Pojištění budov · Průmyslová 12 + sklad Hostivař',
    contractNumber: 'SML-F-2021-0567',
    status: 'aktivní',
    výročí: '15. 6. 2026',
    platba: 'zaplaceno',
    limitPlnění: '45 000 000 Kč',
    spoluÚčast: '50 000 Kč',
  },
  {
    name: 'Zásoby',
    description: 'Pojištění zásob · sklad Hostivař',
    contractNumber: 'SML-F-2021-0568',
    status: 'aktivní',
    výročí: '15. 6. 2026',
    platba: 'nezaplaceno',
    limitPlnění: '8 000 000 Kč',
    spoluÚčast: '20 000 Kč',
  },
  {
    name: 'Odpovědnost za újmu',
    description: 'Obecná odpovědnost firmy · rozsah CZ + EU',
    contractNumber: 'SML-F-2022-0234',
    status: 'aktivní',
    výročí: '28. 2. 2027',
    platba: 'zaplaceno',
    limitPlnění: '20 000 000 Kč',
    spoluÚčast: '10 000 Kč',
  },
  {
    name: 'Přerušení provozu',
    description: 'BI pojištění · navázáno na smlouvy budov',
    contractNumber: 'SML-F-2021-0569',
    status: 'aktivní',
    výročí: '15. 6. 2026',
    platba: 'zaplaceno',
    limitPlnění: '15 000 000 Kč',
    spoluÚčast: '5 000 Kč',
  },
  {
    name: 'Elektronika a vybavení',
    description: 'IT vybavení, servery, kancelářská technika',
    contractNumber: 'SML-F-2020-0891',
    status: 'neaktivní',
    výročí: '31. 12. 2024',
    platba: 'vypršelo',
    limitPlnění: '2 000 000 Kč',
    spoluÚčast: '5 000 Kč',
  },
  {
    name: 'Cestovní pro zaměstnance',
    description: 'Skupinové cestovní pojištění · 45 zaměstnanců',
    contractNumber: 'SML-F-2023-0445',
    status: 'aktivní',
    výročí: '1. 3. 2027',
    platba: 'zaplaceno',
    limitPlnění: '5 000 000 Kč',
    spoluÚčast: '0 Kč',
  },
];

export const companyInteractions: Interaction[] = [
  {
    type: 'email',
    date: '2. 4. 2026',
    relativeDate: '7 dní',
    description: 'Reklamace faktury za Zásoby · SML-F-2021-0568',
    icon: '📧',
  },
  {
    type: 'hovor',
    date: '15. 3. 2026',
    relativeDate: '25 dní',
    description: 'Přihlášení nového vozidla do flotily · Scania R450',
    icon: '📞',
  },
  {
    type: 'hovor',
    date: '10. 2. 2026',
    description: 'Obnova smluv Budovy + Zásoby + BI na rok 2026',
    icon: '📞',
  },
  {
    type: 'email',
    date: '5. 1. 2026',
    description: 'Zaslání certifikátů pojištění pro audit',
    icon: '📧',
  },
];

export const companyTickets: Ticket[] = [
  { id: 'IPEX-2026-0089', source: 'Email', description: 'Reklamace faktury za pojištění zásob Q1/2026', age: '7 dní' },
];

export const companyClaims: Claim[] = [
  {
    id: 'PU-2026-0102',
    type: 'Škoda na vozidle',
    icon: '🚛',
    risk: 'Havarijní pojištění flotily',
    status: 'aktivní',
    limitPlnění: '5 000 000 Kč',
    spoluÚčast: '10 000 Kč',
  },
  {
    id: 'PU-2025-0445',
    type: 'Škoda na majetku',
    icon: '🏭',
    risk: 'Pojištění budov',
    status: 'neaktivní',
  },
];

// ─── Broker Client (Pavel Kratochvíl) ─────────────────────────────────────────

export const brokerClient: BrokerClientInfo = {
  type: 'broker',
  status: 'aktivní',
  name: 'Pavel Kratochvíl',
  čísloBrokera: 'MK-2019-00145',
  telefon: '+420 775 123 456',
  email: 'p.kratochvil@pojistovaci.cz',
  adresa: 'Náměstí Míru 8, Praha 2, 120 00',
  telVerified: true,
  emailVerified: false,
};

export const brokerProducts: BrokerProduct[] = [
  {
    clientName: 'Jana Procházková',
    clientNumber: 'KL-2024-00445',
    name: 'Vozidla',
    description: 'Havarijní pojištění · Ford Focus 1A5 6789',
    contractNumber: 'SML-2024-5102',
    status: 'aktivní',
    výročí: '3. 8. 2026',
    platba: 'zaplaceno',
  },
  {
    clientName: 'Jana Procházková',
    clientNumber: 'KL-2024-00445',
    name: 'Majetek',
    description: 'Pojištění domácnosti · Čechova 5, Brno',
    contractNumber: 'SML-2023-3302',
    status: 'aktivní',
    výročí: '20. 5. 2026',
    platba: 'nezaplaceno',
  },
  {
    clientName: 'Tech Solutions s.r.o.',
    clientNumber: 'KL-F-2023-0012',
    name: 'Flotila',
    description: 'Havarijní pojištění · 5 vozidel',
    contractNumber: 'SML-F-2023-0889',
    status: 'aktivní',
    výročí: '1. 11. 2026',
    platba: 'zaplaceno',
  },
  {
    clientName: 'Tech Solutions s.r.o.',
    clientNumber: 'KL-F-2023-0012',
    name: 'Odpovědnost za újmu',
    description: 'Odpovědnost IT firmy · CZ + SK',
    contractNumber: 'SML-F-2023-0890',
    status: 'aktivní',
    výročí: '1. 11. 2026',
    platba: 'zaplaceno',
  },
  {
    clientName: 'Karel Novotný',
    clientNumber: 'KL-2022-01234',
    name: 'Vozidla',
    description: 'Povinné ručení · VW Golf 3B4 5612',
    contractNumber: 'SML-2022-1234',
    status: 'aktivní',
    výročí: '12. 12. 2026',
    platba: 'zaplaceno',
  },
  {
    clientName: 'Eva Horáková',
    clientNumber: 'KL-2023-00678',
    name: 'Cestovní',
    description: 'Individuální cestovní pojištění · Svět',
    contractNumber: 'SML-2023-0678',
    status: 'aktivní',
    výročí: '30. 9. 2026',
    platba: 'zaplaceno',
  },
  {
    clientName: 'Eva Horáková',
    clientNumber: 'KL-2023-00678',
    name: 'Mazlíčci',
    description: 'Pojištění kočky · Britská krátkosrstá, Sněhulka',
    contractNumber: 'SML-2023-0679',
    status: 'neaktivní',
    výročí: '30. 9. 2025',
    platba: 'vypršelo',
  },
];

export const brokerInteractions: Interaction[] = [
  {
    type: 'hovor',
    date: '1. 4. 2026',
    relativeDate: '8 dní',
    description: 'Dotaz k obnově smlouvy Jana Procházková · Majetek',
    icon: '📞',
  },
  {
    type: 'email',
    date: '15. 3. 2026',
    relativeDate: '25 dní',
    description: 'Předání nového klienta Karel Novotný · POV',
    icon: '📧',
  },
  {
    type: 'email',
    date: '2. 2. 2026',
    description: 'Komisionářský výkaz leden 2026',
    icon: '📧',
  },
];

// ─── Unknown caller ───────────────────────────────────────────────────────────

export const unknownCallerPhone = '+420 731 987 654';

// ─── Call Info ────────────────────────────────────────────────────────────────

export const callDirection = 'Příchozí';
export const callQueue = 'Škody-hlášení';
export const voicebotQuote = 'Chci nahlásit škodu na autě, měla jsem nehodu na parkovišti ve čtvrtek.';
export const voicebotClassification = 'Hlášení pojistné události · vozidlo';

// ─── Whisperer Hints (timed for Jana Nováková call) ──────────────────────────

export const hints: Hint[] = [
  {
    id: 'h1',
    title: '⚠️ Ověření identity klienta',
    subtitle: 'Pro ověření požádejte o rodné číslo a datum a místo narození.',
    category: 'compliance',
    detail: 'Dle bezpečnostní matice: požádejte o rodné číslo A datum a místo narození. Oba údaje musí souhlasit — při neshodě hovor ukončete dle protokolu P-02.',
    script: 'Dobrý den, tady pojišťovna Direct. Abych vám mohl/a pomoci, potřebuji ověřit vaši totožnost. Sdělíte mi prosím rodné číslo a datum narození?',
    appearsAt: 0,
  },
  {
    id: 'h2',
    title: '🎫 Otevřený ticket · Reklamace vyúčtování',
    subtitle: 'IPEX-2025-0042 · čeká 3 dny bez odpovědi. Nabídněte přesun na prioritní frontu.',
    category: 'info',
    detail: 'Klientka zaslala email s nesouhlasem s fakturací HAV za únor 2026. Ticket přiřazen na Back-office, dosud bez odpovědi. Pokud téma klientka zmíní — ujistěte ji, že situace je v řešení, a nabídněte eskalaci.',
    script: 'Vidím, že máte otevřený požadavek ohledně vyúčtování z 5. dubna. Zpracovává ho naše back-office, odpověď by měla přijít do 2 pracovních dnů. Chcete, abych to posunul/a na prioritní frontu?',
    appearsAt: 8,
  },
  {
    id: 'h3',
    title: '📋 Protokol hlášení škody na vozidle',
    subtitle: 'Zjistit: datum + místo + poškozené části + SPZ viníka nebo „viník neznámý".',
    category: 'compliance',
    detail: '1. Datum, čas a místo nehody. 2. Popis poškození (které části vozidla). 3. SPZ viníka nebo poznámka „viník neznámý". 4. Vytvořit číslo PU v systému. 5. Informovat o lhůtě zaslání fotodokumentace (5 prac. dní).',
    script: 'Pomohu vám s nahlášením. Potřebuji: datum a místo nehody, popis poškozených částí a SPZ druhého vozidla — nebo zaznamenám „viník neznámý". Pak přidělíme číslo pojistné události.',
    appearsAt: 18,
  },
  {
    id: 'h4',
    title: '🐾 Nezaplacená splátka · Pojištění mazlíčků',
    subtitle: 'Dlužná splátka 320 Kč · splatnost 1. 3. 2026 · deaktivace hrozí do 31. 3.',
    category: 'info',
    detail: 'Pojištění psa (Jack Russell Terrier, Rexík) má dlužnou splátku 320 Kč ze dne 1. 3. 2026. Pokud nebude uhrazena do 31. 3. 2026, dojde k automatické deaktivaci pojistky.',
    script: 'Mimochodem, vidím, že máte u nás pojistku na mazlíčka a eviduji nezaplacenou splátku z 1. března. Mohu vám poslat platební odkaz SMS, ať si pojistku nedeaktivujete.',
    appearsAt: 35,
  },
  {
    id: 'h5',
    title: '💬 Reakce na námitku · Délka likvidace',
    subtitle: 'Zákonná lhůta 30 dní. Průměr u Direct: 18 dní + SMS notifikace při každé změně stavu.',
    category: 'objection',
    detail: 'Standardní zákonná lhůta likvidace je 30 dní. Průměrná doba likvidace u Direct je 18 dní. Pokud klient zmiňuje negativní zkušenost, uznejte problém a nabídněte přímý kontakt na likvidátora + SMS notifikace.',
    script: 'Rozumím, to je frustrující. Průměrná doba likvidace u nás je 18 dní a budete dostávat SMS při každé změně stavu. Pokud by to trvalo déle, napište mi a eskaluji přímo na likvidátora.',
    appearsAt: 55,
  },
  {
    id: 'h6',
    title: '📸 Instrukce k zaslání fotodokumentace',
    subtitle: 'Min. 4 záběry poškozených partií + celkový záběr s viditelnou SPZ. Do 5 prac. dní.',
    category: 'compliance',
    detail: 'Fotografie poslat na likvidace@direct.cz nebo přes Moje Direct. Minimálně: 4 záběry poškozených partií ze vzdálenosti ~1 m + celkový záběr vozidla s viditelnou SPZ. Lhůta: 5 pracovních dní od hlášení.',
    script: 'Foto nám pošlete do 5 pracovních dní na likvidace@direct.cz nebo přes aplikaci Moje Direct. Potřebujeme 4 záběry poškozené části a celkovou fotku vozidla s SPZ v záběru.',
    appearsAt: 70,
  },
  {
    id: 'h7',
    title: '🏠 Cross-sell · Pojištění domácnosti',
    subtitle: 'Pojistka vypršela 10. 1. 2025, neobnovena. Nabídnout kalkulaci emailem na konci hovoru.',
    category: 'product',
    detail: 'Klientka měla pojištění domácnosti (Vinohradská 42, Praha 2), které vypršelo 10. 1. 2025 a neobnovila. Byt v centru Prahy — relevantní produkt. Nabídnout až na konci hovoru, kdy je klientka spokojená.',
    script: 'Ještě vidím, že vám loni vypršelo pojištění domácnosti. Pro byt v Praze 2 máme teď zajímavou cenu — mohu vám poslat kalkulaci emailem? Nezavazuje vás to k ničemu.',
    appearsAt: 90,
  },
  {
    id: 'h8',
    title: '✅ Shrnutí dalších kroků pro klientku',
    subtitle: 'Připomenout: číslo PU · foto do 5 dní na likvidace@direct.cz · splátka mazlíčků do 31. 3.',
    category: 'compliance',
    detail: '1. Zaslat foto na likvidace@direct.cz do 5 prac. dní. 2. Číslo PU uvést v předmětu emailu. 3. SMS notifikace přijdou automaticky. 4. Splátka mazlíčků — uhradit do 31. 3. 2026.',
    script: 'Shrnutí: číslo PU je [vyplnit]. Pošlete nám fotky do pátku na likvidace@direct.cz. Budeme vás informovat SMS. A nezapomeňte na splátku pojistky pro Rexíka — do konce března. Mohu pro vás ještě něco udělat?',
    appearsAt: 110,
  },
];

// ─── After Call ───────────────────────────────────────────────────────────────

export const summaryText = `Klientka Jana Nováková (KL-2024-00891) volala ohledně hlášení pojistné události na vozidle Škoda Octavia 4A2 3456. Nehoda se stala dne 5. 1. 2026 na parkovišti OC Chodov, Praha 4 — poškozeny levé zadní dveře a blatník, viník neznámý. Klientce bylo přiděleno číslo PU-2026-0051. Informována o zaslání fotodokumentace na likvidace@direct.cz do 5 pracovních dní. Upozorněna na dlužnou splátku pojistky mazlíčků (320 Kč, splatnost 1. 3. 2026).`;

export const zzjText = `Datum: 9. 4. 2026 | Operátor: Petr Svoboda | Klient: Jana Nováková (KL-2024-00891)
Předmět: Hlášení pojistné události — Vozidla HAV
Popis: Klientka nahlásila škodu na vozidle Škoda Octavia (4A2 3456). Datum škody: 5. 1. 2026. Místo: parkoviště OC Chodov, Praha 4. Poškození: levé zadní dveře, zadní blatník. Viník: neznámý (klientka nalezla poškozené vozidlo).
Akce: Zal. PU-2026-0051. Klientka zašle foto na likvidace@direct.cz do 14. 4. 2026. Upozorněna na dlužnou splátku Mazlíčci (320 Kč).
Stav: Čeká na fotodokumentaci.`;

// ─── Queue Mappings ───────────────────────────────────────────────────────────

export const skillMappings: Skill[] = [
  {
    id: 's1',
    name: 'Retence',
    inboundQueues: ['Retence-CZ', 'Retence-callback', 'Retence-chat'],
    outboundQueues: ['Retence-proaktivní', 'Retence-renewal'],
    maxRetry: 3,
  },
  {
    id: 's2',
    name: 'Škody — Auto',
    inboundQueues: ['Škody-auto-příjem', 'Škody-auto-likvidace'],
    outboundQueues: ['Škody-auto-followup'],
    maxRetry: 5,
  },
  {
    id: 's3',
    name: 'Škody — Majetek',
    inboundQueues: ['Škody-maj-příjem', 'Škody-maj-kontrola'],
    outboundQueues: ['Škody-maj-followup'],
    maxRetry: 4,
  },
  {
    id: 's4',
    name: 'Sjednávání',
    inboundQueues: ['Sjednávání-auto', 'Sjednávání-majetek', 'Sjednávání-web'],
    outboundQueues: ['Sjednávání-kampaň', 'Sjednávání-lead'],
    maxRetry: 4,
  },
  {
    id: 's5',
    name: 'Mazlíčci',
    inboundQueues: ['Mazlíčci-info', 'Mazlíčci-škody'],
    outboundQueues: ['Mazlíčci-renewal'],
    maxRetry: 2,
  },
  {
    id: 's6',
    name: 'Cestovní',
    inboundQueues: ['Cestovní-info', 'Cestovní-škody'],
    outboundQueues: ['Cestovní-outbound', 'Cestovní-kampaň'],
    maxRetry: 3,
  },
  {
    id: 's7',
    name: 'Majetek',
    inboundQueues: ['Majetek-info', 'Majetek-sjednávání'],
    outboundQueues: ['Majetek-renewal', 'Majetek-kampaň'],
    maxRetry: 4,
  },
  {
    id: 's8',
    name: 'VIP',
    inboundQueues: ['VIP-přímý', 'VIP-callback'],
    outboundQueues: ['VIP-proaktivní'],
    maxRetry: 5,
  },
];

// ─── Operators + Skill Matrix ─────────────────────────────────────────────────

export const productColumns = ['Vozidla', 'Majetek', 'Mazlíčci', 'Cestovní', 'Motorky', 'Odpovědnost'];

export const operators: Operator[] = [
  { id: 'o1', name: 'Petr Svoboda',    team: 'KC',      skills: { Vozidla: 3, Majetek: 2, Mazlíčci: 0, Cestovní: 1, Motorky: 1, Odpovědnost: 0 } },
  { id: 'o2', name: 'Marie Dvořáková', team: 'KC',      skills: { Vozidla: 2, Majetek: 3, Mazlíčci: 1, Cestovní: 2, Motorky: 0, Odpovědnost: 2 } },
  { id: 'o3', name: 'Jan Horák',       team: 'KAPU',    skills: { Vozidla: 3, Majetek: 1, Mazlíčci: 2, Cestovní: 0, Motorky: 3, Odpovědnost: 1 } },
  { id: 'o4', name: 'Eva Procházková', team: 'KAPU',    skills: { Vozidla: 1, Majetek: 3, Mazlíčci: 2, Cestovní: 3, Motorky: 0, Odpovědnost: 3 } },
  { id: 'o5', name: 'Tomáš Veselý',   team: 'Poradci', skills: { Vozidla: 2, Majetek: 2, Mazlíčci: 3, Cestovní: 1, Motorky: 2, Odpovědnost: 3 } },
  { id: 'o6', name: 'Lucie Černá',    team: 'Poradci', skills: { Vozidla: 3, Majetek: 1, Mazlíčci: 2, Cestovní: 2, Motorky: 1, Odpovědnost: 2 } },
];

export const skillLevels: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Neumí',  color: '#809f99', bg: '#f2f5f5' },
  1: { label: 'Junior', color: '#006b55', bg: '#d1f3e7' },
  2: { label: 'Medior', color: '#415b00', bg: '#eaf3a3' },
  3: { label: 'Senior', color: '#004033', bg: '#c4de00' },
};
