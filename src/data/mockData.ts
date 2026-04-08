export interface Client {
  name: string;
  rodneČíslo: string;
  telefon: string;
  email: string;
  adresa: string;
  čísloKlienta: string;
}

export interface Product {
  name: string;
  type: string;
  status: 'aktivní' | 'neaktivní';
  výročí: string;
  platba: 'zaplaceno' | 'nezaplaceno' | 'vypršelo';
}

export interface Interaction {
  type: 'hovor' | 'email' | 'web';
  date: string;
  description: string;
  icon: string;
}

export interface Ticket {
  id: string;
  source: 'Email' | 'Telefon' | 'Web';
  description: string;
  age: string;
}

export interface Hint {
  id: string;
  icon: string;
  title: string;
  category: 'compliance' | 'objection' | 'product' | 'info';
  detail: string;
  script?: string;
  kbCitation?: string;
  isActive: boolean;
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

export const client: Client = {
  name: 'Jana Nováková',
  rodneČíslo: '845612/1234',
  telefon: '+420 602 345 678',
  email: 'jana.novakova@email.cz',
  adresa: 'Vinohradská 42, Praha 2, 120 00',
  čísloKlienta: 'KL-2024-00891',
};

export const products: Product[] = [
  { name: 'Auto HAV', type: 'Havarijní pojištění', status: 'aktivní', výročí: '15. 3. 2025', platba: 'zaplaceno' },
  { name: 'POV', type: 'Povinné ručení', status: 'aktivní', výročí: '15. 3. 2025', platba: 'zaplaceno' },
  { name: 'Cestovní pojištění', type: 'Cestovní', status: 'neaktivní', výročí: '1. 6. 2024', platba: 'vypršelo' },
  { name: 'Pojištění mazlíčků', type: 'Mazlíčci', status: 'aktivní', výročí: '8. 9. 2025', platba: 'nezaplaceno' },
];

export const interactions: Interaction[] = [
  { type: 'hovor', date: '12. 1. 2025', description: 'Dotaz na stav pojistné události', icon: '📞' },
  { type: 'email', date: '28. 12. 2024', description: 'Žádost o změnu adresy', icon: '📧' },
  { type: 'web', date: '15. 12. 2024', description: 'Online kalkulace cestovního pojištění', icon: '🌐' },
  { type: 'hovor', date: '1. 12. 2024', description: 'Prodloužení POV', icon: '📞' },
  { type: 'email', date: '15. 11. 2024', description: 'Potvrzení platby pojistného', icon: '📧' },
  { type: 'web', date: '2. 11. 2024', description: 'Stažení zelené karty', icon: '🌐' },
  { type: 'hovor', date: '10. 10. 2024', description: 'Dotaz na rozsah krytí HAV', icon: '📞' },
  { type: 'email', date: '5. 9. 2024', description: 'Změna kontaktních údajů', icon: '📧' },
];

export const tickets: Ticket[] = [
  { id: 'IPEX-2025-0042', source: 'Email', description: 'Reklamace vyúčtování', age: '3 dny' },
  { id: 'IPEX-2025-0038', source: 'Telefon', description: 'Hlášení škody', age: '5 dnů' },
];

export const callReason = 'Klient volá ohledně pojistné události na vozidle — hlášení škody po nehodě';
export const callReasonSource = 'MAX voicebot — NLP klasifikace';

export const hints: Hint[] = [
  {
    id: 'h1',
    icon: '⚠️',
    title: 'Ověřte identitu klienta',
    category: 'compliance',
    detail: 'Dle matice ověření požádejte klienta o rodné číslo a datum narození. Povinné pro všechny hovory týkající se pojistných událostí.',
    kbCitation: 'KB-SEC-001: Matice ověření identity',
    isActive: true,
  },
  {
    id: 'h2',
    icon: '💡',
    title: 'Klient zmiňuje vysokou cenu',
    category: 'objection',
    detail: 'Nabídněte porovnání rozsahu krytí s konkurencí. Direct pojišťovna pokrývá i asistenční služby v ceně.',
    script: 'Rozumím, že cena je důležitá. Pojďme se podívat, co všechno je v ceně zahrnuto — u nás máte asistenční služby, odtah vozidla i náhradní vůz bez příplatku.',
    kbCitation: 'KB-PROD-042: Srovnání HAV s konkurencí',
    isActive: true,
  },
  {
    id: 'h3',
    icon: '🐾',
    title: 'Nabídněte produkt Mazlíčci',
    category: 'product',
    detail: 'Klient má psa dle záznamu z předchozího hovoru. Pojištění mazlíčků je aktivní, ale má nezaplacenou splátku.',
    kbCitation: 'KB-PROD-018: Pojištění mazlíčků',
    isActive: false,
  },
  {
    id: 'h4',
    icon: '⚡',
    title: 'Nezaplacená splátka pojištění mazlíčků',
    category: 'info',
    detail: 'Upozorněte klienta na nezaplacenou splátku pojištění mazlíčků. Splatnost byla 1. 3. 2025. Při nezaplacení do 30 dnů dojde k deaktivaci.',
    isActive: false,
  },
];

export const summaryText = `Klientka Jana Nováková (KL-2024-00891) volala ohledně hlášení pojistné události na vozidle. Nehoda se stala dne 5. 1. 2025 na parkovišti OC Chodov. Poškození: levé zadní dveře a blatník. Klientka potvrdila, že má platné HAV pojištění. Událost byla zaregistrována pod číslem PU-2025-00234. Klientce byl sdělen další postup — zaslání fotodokumentace emailem na likvidace@direct.cz.`;

export const zzjText = `Datum: 8. 4. 2026 | Operátor: Petr Svoboda | Klient: Jana Nováková (KL-2024-00891)
Předmět: Hlášení pojistné události — Auto HAV
Popis: Klientka nahlásila škodu na vozidle Škoda Octavia (4A2 3456) ze dne 5. 1. 2025. Místo nehody: parkoviště OC Chodov, Praha 4. Poškození: levé zadní dveře, blatník. Viník: neznámý, klientka nalezla poškození po návratu k vozidlu.
Akce: Založena PU-2025-00234. Klientka zašle fotodokumentaci na likvidace@direct.cz do 5 pracovních dnů.
Stav: Čeká na fotodokumentaci.`;

export const skillMappings: Skill[] = [
  { id: 's1', name: 'Retence', inboundQueues: ['Retence-CZ', 'Retence-callback'], outboundQueues: ['Retence-outbound'], maxRetry: 3 },
  { id: 's2', name: 'Škody', inboundQueues: ['Škody-hlášení', 'Škody-likvidace'], outboundQueues: ['Škody-followup'], maxRetry: 5 },
  { id: 's3', name: 'Sjednávání', inboundQueues: ['Sjednávání-auto', 'Sjednávání-majetek'], outboundQueues: ['Sjednávání-kampaň'], maxRetry: 4 },
  { id: 's4', name: 'Podnikání', inboundQueues: ['Podnikání-info'], outboundQueues: ['Podnikání-akvizice', 'Podnikání-renewal'], maxRetry: 3 },
];

export const operators: Operator[] = [
  { id: 'o1', name: 'Petr Svoboda', team: 'KC', skills: { HAV: 3, POV: 3, Majetek: 2, Cestovní: 1, Mazlíčci: 0, Podnikání: 0 } },
  { id: 'o2', name: 'Marie Dvořáková', team: 'KC', skills: { HAV: 2, POV: 2, Majetek: 3, Cestovní: 2, Mazlíčci: 1, Podnikání: 0 } },
  { id: 'o3', name: 'Jan Horák', team: 'KAPU', skills: { HAV: 3, POV: 3, Majetek: 1, Cestovní: 0, Mazlíčci: 2, Podnikání: 1 } },
  { id: 'o4', name: 'Eva Procházková', team: 'KAPU', skills: { HAV: 1, POV: 1, Majetek: 3, Cestovní: 3, Mazlíčci: 2, Podnikání: 2 } },
  { id: 'o5', name: 'Tomáš Veselý', team: 'Poradci', skills: { HAV: 3, POV: 2, Majetek: 2, Cestovní: 1, Mazlíčci: 3, Podnikání: 3 } },
  { id: 'o6', name: 'Lucie Černá', team: 'Poradci', skills: { HAV: 2, POV: 3, Majetek: 1, Cestovní: 2, Mazlíčci: 2, Podnikání: 3 } },
];

export const productColumns = ['HAV', 'POV', 'Majetek', 'Cestovní', 'Mazlíčci', 'Podnikání'];

export const skillLevels: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Neumí', color: '#5a5a5a', bg: '#e8e8e8' },
  1: { label: 'Junior', color: '#376c5d', bg: '#b3ebd8' },
  2: { label: 'Medior', color: '#535f00', bg: '#d5f025' },
  3: { label: 'Senior', color: '#1a4a2e', bg: '#C4DE00' },
};
