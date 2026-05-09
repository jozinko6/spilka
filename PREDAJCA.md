# SPILKA Terasa — Predajná dokumentácia pre odovzdanie

> Tento dokument je určený pre **predávajúceho** — osobu, ktorá odovzdáva webový systém reštaurácii. Slúži ako sprievodca pri predaji a kompletný prehľad toho, čo kupujúci dostáva, čo musí prispôsobiť a ako systém funguje.

---

## 1. Prehľad dodávky

Predávame **kompletný webový systém pre reštauráciu SPILKA Terasa**, ktorý zahŕňa verejnú prezentáciu, administračný panel a objednávkový systém so stolovými QR kódmi. Systém je plne funkčný, ready-to-deploy a vyžaduje len minimálnu prispôsobbu.

| Súčasť | Popis |
|--------|-------|
| **Prezentáčny web** | Moderný responzívny web — informácie o reštaurácii, jedálny lístok, ponuka dňa, akcie, galéria, kontakt |
| **Admin panel** | Kompletný redakčný systém na správu obsahu — menu, denná ponuka, akcie, galéria, stoly, objednávky |
| **Objednávkový systém** | Mobilná stránka pre hosťov s QR kódmi na stolocho — objednávanie a sledovanie stavu v reálnom čase |
| **WebSocket servis** | Real-time komunikácia pre okamžité oznámenia o nových objednávkach a zmenách stavu |

---

## 2. Čo kupujúci dostane

| # | Dodávka | Popis |
|---|---------|-------|
| 1 | **Kompletný webový systém** | Prezentácia + admin panel + objednávkový systém v jednom balíku |
| 2 | **Zdrojový kód na GitHub** | Plný prístup k repozitáru: [https://github.com/jozinko6/spilka](https://github.com/jozinko6/spilka) |
| 3 | **Inštalačný skript** | `install.sh` — interaktívny skript, ktorý prevedie celou inštaláciou |
| 4 | **Manuál pre prevádzkovateľa** | `MANUAL.md` — podrobný návod na obsluhu, údržbu a riešenie problémov |
| 5 | **Admin prístupy** | Prihlasovacie údaje: **admin** / **spilka2026** (treba zmeniť!) |
| 6 | **QR kód systém pre stoly** | Generovanie a tlač QR kódov pre každý stôl — hosť naskenuje a objedná |
| 7 | **WebSocket servis** | Real-time objednávky — okamžité notifikácie v admin paneli a pre hosťa |
| 8 | **Ukážkové dáta** | Databáza s ukážkovým menu, stôlmi a obsahom — pripravené na úpravu |

---

## 3. Systémové požiadavky

### Minimálne požiadavky na server

| Komponent | Požiadavka |
|-----------|------------|
| **Operačný systém** | Linux (Ubuntu 22.04+ odporúčaný) |
| **Node.js** | verzia 18 alebo novšia (odporúčaná 20+) |
| **RAM** | minimálne 512 MB (odporúčané 1 GB) |
| **Disk** | minimálne 500 MB voľného miesta |
| **CPU** | 1 jadro (odporúčané 2) |

### Softvér

| Softvér | Účel |
|---------|------|
| **Node.js 20+** | Beh webového servera |
| **npm alebo Bun** | Správa balíčkov |
| **PM2** (odporúčané) | Správa procesov a automatický reštart |
| **Nginx** (odporúčané) | Reverse proxy a SSL |
| **Let's Encrypt** | SSL certifikát (zadarmo) |

---

## 4. Inštalačný postup krok za krokom

Tieto kroky môže kupujúci vykonať sám alebo s vašou asistenciou:

1. **Stiahnutie zdrojového kódu**
   ```bash
   git clone https://github.com/jozinko6/spilka.git
   cd spilka
   ```

2. **Spustenie inštalačného skriptu**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
   Skript sa opýta na port a cestu k databáze, nainštaluje závislosti, vytvorí databázu a ponúkne naplnenie ukážkovými dátami.

3. **Manuálna inštalácia (alternatíva)**
   ```bash
   npm install
   cp .env.example .env        # upravte podľa potreby
   npm run db:push             # vytvorenie databázy
   npm run seed                # naplnenie ukážkovými dátami
   npm run build               # produkčný build
   npm run start               # spustenie servera
   ```

4. **Nastavenie WebSocket servisu**
   ```bash
   cd mini-services/order-service
   npm install
   npm run dev                 # alebo pm2 start npm --name "spilka-ws" -- dev
   ```

5. **Nastavenie Nginx reverse proxy** (pre produkciu)
   - Nainštalujte Nginx
   - Nakonfigurujte reverse proxy na port 3000 (web) a 3003 (WebSocket)
   - Pozri konfiguráciu v `MANUAL.md` sekcia 8

6. **Nastavenie SSL certifikátu**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d vasa-domena.sk
   ```

7. **Prvé prihlásenie do admina**
   - Otvorte `https://vasa-domena.sk/admin`
   - Prihláste sa: **admin** / **spilka2026**
   - **Okamžite zmeňte heslo!**

---

## 5. Čo kupujúci musí zmeniť/prispôsobiť

Po prevzatí systému musí kupujúci prispôsobiť nasledujúce položky:

### Povinné zmeny

| # | Čo zmeniť | Kde | Ako |
|---|-----------|-----|-----|
| 1 | **Názov reštaurácie a logo** | Zdrojový kód — layout, hero, footer | Upraviť v súbore `src/app/layout.tsx` a príslušných komponentoch |
| 2 | **Kontaktné údaje** | Zdrojový kód — kontakt sekcia, footer | Upraviť adresu, telefón, email v `src/components/contact.tsx` a `src/components/footer.tsx` |
| 3 | **Otváracie hodiny** | Zdrojový kód — kontakt sekcia | Upraviť v `src/components/contact.tsx` |
| 4 | **Jedálny lístok** | Admin panel → Jedálny lístok | Vymazať ukážkové dáta, pridať vlastné položky |
| 5 | **Denné menu** | Admin panel → Ponuka dňa | Nastaviť menu pre každý deň v týždni |
| 6 | **Admin heslo** | Kritické! | Zmeniť predvolené heslo `spilka2026` na silné vlastné heslo |
| 7 | **Doména a hosting** | DNS, Nginx konfigurácia | Nasmerovať doménu na VPS server, nakonfigurovať Nginx |

### Voliteľné zmeny

| # | Čo zmeniť | Kde | Ako |
|---|-----------|-----|-----|
| 8 | **Obrázky v galérii** | Admin panel → Galéria | Pridať vlastné fotografie reštaurácie a jedál |
| 9 | **Farby a štýl** | Zdrojový kód — CSS | Upraviť farebnú schému v `src/app/globals.css` (oklch farby) |
| 10 | **Akcie a udalosti** | Admin panel → Akcie | Pridať vlastné akcie (kvízy, hudba, eventy) |
| 11 | **Stoly a QR kódy** | Admin panel → Stoly | Nastaviť čísla a zóny stolov, vygenerovať QR kódy |
| 12 | **Hlavné obrázky** | `public/images/` | Vymeniť AI-generované obrázky za skutočné fotografie |

> **Tip pre predajcu:** Ponúknite kupujúcemu, že prvú sadu zmien urobíte vy ako súčasť dodávky. Zvýši to vnímanú hodnotu a zjednoduší to odovzdanie.

---

## 6. Odhadované náklady na prevádzku

| Položka | Mesačné náklady | Poznámka |
|---------|-----------------|----------|
| **VPS hosting** | 3–5 €/mesiac | Contabo, Hetzner alebo podobný poskytovateľ |
| **Doména** | ~1 €/mesiac | 10–15 €/rok pri bežných registrátoroch |
| **SSL certifikát** | 0 €/mesiac | Zadarmo s Let's Encrypt (automatické obnovovanie) |
| **WebSocket servis** | 0 €/mesiac | Beží na rovnakom VPS serveri |
| | | |
| **Celkom** | **približne 4–6 €/mesiac** | Bez nákladov na údržbu alebo podporu |

> **Poznámka:** Tieto náklady platia pri vlastnom VPS serveri. Pri použití managed hostingu (napr. Vercel) môžu byť náklady odlišné — SQLite vyžaduje vlastný server alebo prechod na PostgreSQL.

---

## 7. Podpora a údržba

### Čo je súčasťou dodávky

| Typ | Rozsah |
|-----|--------|
| **Technická dokumentácia** | Kompletná — `MANUAL.md` s návodmi na inštaláciu, obsluhu a riešenie problémov |
| **Inštalačný skript** | `install.sh` — automatická inštalácia |
| **Ukážkové dáta** | Databáza s ukážkovým obsahom na rýchly štart |

### Odporúčaná údržba

| Činnosť | Frekvencia | Popis |
|---------|------------|-------|
| **Záloha databázy** | Denne (automaticky) | Cron úloha na kopírovanie `db/custom.db` |
| **Aktualizácia Node.js** | Podľa potreby | Bezpečnostné aktualizácie |
| **Obnova SSL certifikátu** | Automaticky | Let's Encrypt obnovuje automaticky |
| **Kontrola logov** | Podľa potreby | `pm2 logs spilka` |
| **Aktualizácia obsahu** | Priebežne | Cez admin panel — menu, akcie, galéria |

### Možnosti rozšírenia (navrhujte ako upsell)

| Rozšírenie | Popis |
|------------|-------|
| **Online platby** | Integrácia s platobnou bránou (Stripe, CardPay) |
| **Rezervačný systém** | Online rezervácie stolov |
| **Emailový newsletter** | Automatické oznámenia o akciách |
| **Vernostný program** | Body za objednávky, zľavy pre stálych hosťov |
| **Analýta** | Google Analytics alebo Plausible |
| **Viacero jazykov** | Anglická verzia stránky pre turistov |

---

## 8. Často kladené otázky

### Všeobecné

| Otázka | Odpoveď |
|--------|---------|
| **Môžem systém prevádzkovať na inom hostingu?** | Áno, systém beží na akomkoľvek Linuxovom serveri s Node.js 18+. Odporúčame VPS s plným prístupom. |
| **Potrebujem programátora na údržbu?** | Nie, bežná údržba (pridávanie menu, akcií, obrázkov) sa robí cez admin panel bez technických znalostí. |
| **Môžem zmeniť farby a dizajn?** | Áno, ale to vyžaduje základné znalosti CSS. Farebná schéma je v jednom súbore (`globals.css`). |
| **Je systém bezpečný?** | Systém používa SSL šifrovanie, admin prihlásenie s tokenom. Dôležité je zmeniť predvolené heslo a pravidelne zálohovať. |
| **Funguje aj bez internetu?** | Nie, ide o webovú aplikáciu. Na prevádzku je potrebný internetový pripojenie. |

### Objednávkový systém

| Otázka | Odpoveď |
|--------|---------|
| **Ako hosť objedná?** | Naskenuje QR kód na stole, zobrazí sa mu mobilný jedálny lístok, vyberie jedlá a odošle objednávku. |
| **Vidí hosť stav objednávky?** | Áno, v reálnom čase — prijaté, pripravuje sa, pripravené, podané. |
| **Môže hosť platiť online?** | Nie, momentálne len objednávanie. Platenie je v reštaurácii. (Možné rozšírenie v budúcnosti.) |
| **Koľko stolov podporuje systém?** | Neobmedzene. Stoly sa pridávajú cez admin panel. |
| **Ako vytlačím QR kódy?** | V admin paneli v záložke Stoly — každý stôl má tlačidlo na zobrazenie QR kódu. |

### Technické

| Otázka | Odpoveď |
|--------|---------|
| **Akú databázu systém používa?** | SQLite — jednoduchá, rýchla, bez nutnosti samostatného databázového servera. |
| **Môžem previesť na PostgreSQL?** | Áno, systém používa Prisma ORM, ktorý podporuje PostgreSQL. Vyžaduje zmenu `DATABASE_URL` v `.env`. |
| **Čo ak server padne?** | S PM2 sa automaticky reštartuje. Odporúčame nastaviť `pm2 startup` pre automatické spustenie po reštarte. |
| **Ako zálohujem dáta?** | Jednoducho — skopírujte súbor `db/custom.db`. Pozri `MANUAL.md` sekcia 9. |

---

## 9. Kontrolný zoznam pri predaji

Tento zoznam použite pri odovzdávaní systému kupujúcemu. Postupujte bod po bode a zaškrtávajte splnené položky.

### Pred odovzdaním

- [ ] Systém je nasadený a funkčný na testovacej URL
- [ ] Admin panel je prístupný a všetky funkcie fungujú
- [ ] Ukážkové dáta sú načítané v databáze
- [ ] QR kódy pre stoly sú vygenerované a otestované
- [ ] WebSocket servis beží a real-time notifikácie fungujú
- [ ] Kontaktný formulár odosiela správy
- [ ] Responzívny dizajn otestovaný na mobile aj desktope
- [ ] SSL certifikát je aktivovaný (pre produkčnú URL)

### Pri odovzdaní

- [ ] Kupujúci má prístup k GitHub repozitáru: [https://github.com/jozinko6/spilka](https://github.com/jozinko6/spilka)
- [ ] Kupujúci dostal kópiu zdrojového kódu (zip alebo git clone)
- [ ] Kupujúci dostal `MANUAL.md` — manuál pre prevádzkovateľa
- [ ] Kupujúci dostal tento dokument `PREDAJCA.md`
- [ ] Kupujúci pozná admin prístupy: **admin** / **spilka2026**
- [ ] Kupujúci vedie, že **musí zmeniť admin heslo**
- [ ] Prešli ste spolu všetky sekcie admin panela
- [ ] Kupujúci vie, ako pridávať/odstraňovať položky menu
- [ ] Kupujúci vie, ako nastaviť denné menu
- [ ] Kupujúci vie, ako spravovať stoly a QR kódy
- [ ] Kupujúci vie, ako prijímať a spravovať objednávky

### Po odovzdaní

- [ ] Kupujúci zmenil admin heslo z predvoleného
- [ ] Kupujúci nastavil vlastnú doménu a DNS
- [ ] Kupujúci nakonfiguroval automatické zálohy databázy
- [ ] Kupujúci nahradil ukážkové dáta vlastným obsahom
- [ ] Kupujúci nahradil AI-generované obrázky skutočnými fotografiami
- [ ] Kupujúci vygeneroval a vytlačil QR kódy pre stoly
- [ ] Nastavené automatické obnovovanie SSL certifikátu
- [ ] PM2 nastavené na automatický reštart (`pm2 startup`)
- [ ] Kupujúci má kontakt na technickú podporu

---

## Zhrnutie pre predajcu

| Položka | Hodnota |
|---------|---------|
| **Produkt** | Kompletný reštauračný webový systém s objednávkami |
| **Stav** | Plne funkčný, ready-to-deploy |
| **Náklady na prevádzku** | ~4–6 €/mesiac |
| **Technická zložitosť** | Nízka — bežná údržba cez admin panel |
| **Rozšíriteľnosť** | Vysoká — modulárna architektúra, zdrojový kód k dispozícii |
| **Podpora** | Kompletná dokumentácia, manuál, inštalačný skript |

> **Posledná rada:** Pri predaji zdôraznite, že ide o **kompletný systém** — nielen web, ale aj admin panel a objednávkový systém. Toto je hodnota, ktorú bežné webdizajnové štúdia neposkytujú v jednom balíku. Porovnajte s cenou samostatného webu (300–800 €), admin panela (200–500 €) a objednávkového systému (200–600 €/rok pri ChoiceQR a podobných službách).

---

*Dokument vytvorený pre účely predaja systému SPILKA Terasa.*
