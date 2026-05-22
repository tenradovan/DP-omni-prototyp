// Glosář zkratek a pojmů používaných v dashboardu
// Slouží jako zdroj pro tooltip vysvětlivky napříč aplikací

export const glossary: Record<string, string> = {
  // ── Produktové zkratky ─────────────────────────────────────────────────────
  POV: 'Povinné ručení — zákonné pojištění odpovědnosti za škodu způsobenou provozem vozidla třetím osobám',
  HAV: 'Havarijní pojištění — pojištění škod na vlastním vozidle, tzv. CASCO (živelné, odcizení, havárie)',
  AUTO: 'Pojištění vozidel — zahrnuje POV, HAV a připojistění (skla, asistence, úraz řidiče)',
  MAJ: 'Pojištění majetku — domácnost, nemovitost, odpovědnost v občanském životě',
  MAZL: 'Pojištění mazlíčků — veterinární péče, operace a hospitalizace domácích zvířat',
  TRAVEL: 'Cestovní pojištění — léčebné výlohy v zahraničí, úraz, storno cesty, zavazadla',
  FLEET: 'Flotilové pojištění — POV + HAV pro firemní vozový park (více vozidel)',
  BUD: 'Pojištění budov — stavby a nemovitosti (požár, živelné pohromy, vloupání)',
  ZÁS: 'Pojištění zásob — ochrana skladových zásob a obchodního zboží firmy',
  ODP: 'Pojištění odpovědnosti za újmu — obecná a profesní odpovědnost firmy nebo osoby',
  BI: 'Business Interruption — pojištění přerušení provozu při škodní události (výpadek výnosů)',
  EL: 'Pojištění elektroniky — IT technika, servery, stroje a kancelářské vybavení',
  MTK: 'Pojištění motocyklů — povinné ručení a havarijní pojištění pro motorky a mopedy',
  MAX: 'MAX — prémiová varianta krytí s rozšířenými limity a nulovou nebo nižší spoluúčastí',

  // ── Systémové a procesní zkratky ──────────────────────────────────────────
  NC: 'NewCore — interní informační systém pojišťovny pro správu klientů, smluv a pojistných událostí',
  ZZJ: 'Záznam z jednání — povinná dokumentace shrnující výsledky pojistného hovoru nebo schůzky',
  ACW: 'After Call Work — čas po skončení hovoru určený k dokončení dokumentace a zápisu ZZJ',
  IDD: 'Insurance Distribution Directive — evropská směrnice o distribuci pojištění, v ČR od října 2018',
  SPŮ: 'Správa pojistných událostí — oddělení odpovědné za posouzení a likvidaci škod',
  BP: 'Bonus/Malus — systém zvýhodnění (bonus) nebo zdražení (malus) pojistného podle škodního průběhu',
  PU: 'Pojistná událost — škoda nebo událost splňující podmínky pro pojistné plnění',
  KAPU: 'Klientský asistent pojistných událostí — specializovaný tým pro komplexní vedení a řešení škod',
  KC: 'Klientské centrum — tým zajišťující zákaznický servis a telefonický kontakt s klienty',
  IPEX: 'IPEX — interní ticketovací systém pro evidenci požadavků, reklamací a komunikace s klienty',

  // ── Stavové indikátory ────────────────────────────────────────────────────
  OK: 'Pojistné je zaplaceno, smlouva je aktivní',
  DLUH: 'Evidován dluh na pojistném — smlouva hrozí deaktivací, klientovi je třeba připomenout platbu',
  Vypršelo: 'Pojistná smlouva skončila a nebyla obnovena — krytí není aktivní',

  // ── Finanční pojmy ────────────────────────────────────────────────────────
  limitPlnění: 'Limit plnění — maximální částka, kterou pojišťovna vyplatí v rámci jedné pojistné události',
  spoluÚčast: 'Spoluúčast — část škody, kterou hradí pojištěný z vlastních prostředků; zbytek kryje pojišťovna',

  // ── Datumy ────────────────────────────────────────────────────────────────
  datumVzniku: 'Datum vzniku škody — kdy pojistná událost nastala',
  datumHlášení: 'Datum hlášení — kdy byla pojistná událost nahlášena pojišťovně',
  datumUzavření: 'Datum uzavření — kdy byla pojistná událost vyřízena (plnění vyplaceno nebo zamítnuto)',
  začátekSmlouvy: 'Počátek pojistné smlouvy — datum od kdy je pojistné krytí platné',
  datumSjednání: 'Datum sjednání rizika — kdy bylo toto připojistění přidáno do smlouvy',
  relativeDays: 'Počet dní od nahlášení pojistné události do dnes',

  // ── UI prvky ──────────────────────────────────────────────────────────────
  verified: 'Kontaktní údaj ověřen — klient potvrdil při posledním hovoru nebo přes klientskou zónu',
  verifiedTel: 'Telefonní číslo bylo ověřeno — klient jej potvrdil při posledním kontaktu',
  verifiedEmail: 'E-mailová adresa byla ověřena — klient ji potvrdil nebo klikl na ověřovací odkaz',
  aktivníApp: 'Mobilní aplikace Moje Direct — klient ji má aktivní a může přijímat push notifikace',
  klientskáZóna: 'Klientská zóna direct.cz — klient má aktivní přihlášení na webovém portálu',
  newcoreLink: 'Otevřít kompletní profil klienta v systému NewCore (v nové záložce)',
  AI: 'Obsah byl vygenerován umělou inteligencí — doporučujeme zkontrolovat před použitím v dokumentaci',
  fronta: 'Příchozí telefonní fronta, ze které byl hovor přijat — určuje tým a téma hovoru',
  duvodHovoru: 'Klasifikace důvodu hovoru provedená voicebotem před přepojením na operátora',
};
