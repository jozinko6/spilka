# SPILKA Terasa — Manuál pre prevádzkovateľa

**Verzia:** 1.1.0
**Dátum:** 5. marec 2026
**GitHub:** https://github.com/jozinko6/spilka

---

## ⚡ Rýchly štart (5 minút)

Ak ste netrpezní a chcete web rozbehať čo najskôr:

```bash
# 1. Nainštalujte závislosti
bun install

# 2. Vytvorte .env súbor
cp .env.example .env

# 3. Vytvorte databázu a naplňte dátami
bun run db:push
bun run seed

# 4. Spustite vývojársky server
bun run dev

# 5. V inom termináli spustite WebSocket servis
cd mini-services/order-service && bun install && bun run dev
```

Webová stránka: **http://localhost:3000**
Admin panel: **http://localhost:3000/admin** (meno: `admin`, heslo: `spilka2026`)
WebSocket servis: **port 3003**

> ⚠️ **Nezabudnite** zmeniť predvolené heslo po prvej prihlásení! Pozri [Zmena admin hesla](#zmena-admin-hesla).

---

## 📋 Obsah

1. [Prehľad systému](#1-prehľad-systému)
2. [Požiadavky na server](#2-požiadavky-na-server)
3. [Inštalácia](#3-inštalácia)
4. [Spustenie](#4-spustenie)
5. [Admin panel](#5-admin-panel)
6. [Zmena admin hesla](#zmena-admin-hesla)
7. [Prispôsobenie webstránky](#7-prispôsobenie-webstránky)
8. [Objednávkový systém pri stolu](#8-objednávkový-systém-pri-stolu)
9. [WebSocket objednávkový servis](#9-websocket-objednávkový-servis)
10. [Správa QR kódov](#10-správa-qr-kódov)
11. [Nasadenie na produkciu](#11-nasadenie-na-produkciu)
12. [Údržba a zálohy](#12-údržba-a-zálohy)
13. [Riešenie problémov](#13-riešenie-problémov)
14. [Technická špecifikácia](#14-technická-špecifikácia)
15. [História verzií](#15-história-verzií)

---

## 1. Prehľad systému

SPILKA Terasa je komplexný webový systém pre reštauráciu, ktorý zahŕňa:

| Funkcia | Popis |
|---------|-------|
| **Prezentáčný web** | Moderný responzívny web s informáciami o reštaurácii, jedálnym lístkom, ponukou dňa, akciami a galériou |
| **Jedálny lístok** | Interaktívne menu s 6 kategóriami, alergénmi, váhami a cenami |
| **Ponuka dňa** | Automatické zobrazovanie denného menu podľa dňa v týždni |
| **Objednávkový systém** | QR-kód objednávanie priamo zo stola (podobne ako ChoiceQR) |
| **Admin panel** | Kompletná správa menu, denných ponúk, akcií, galérie, stolov a objednávok |
| **Real-time notifikácie** | Okamžité oznámenia o nových objednávkach pre kuchyňu cez WebSocket |
| **Rozvoz jedla** | Odkazy na Wolt a Bolt Food pre doručovanie |

### Architektúra

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Návštevník │────▶│  Next.js Web │────▶│   SQLite DB │
│   (mobil/PC) │     │  (port 3000) │     │  (Prisma)   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
┌─────────────┐     ┌──────▼──────┐
│   Admin UI   │────▶│   API Routes │
│  /admin      │     │  CRUD oper.  │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  WebSocket   │
                    │  (port 3003) │
                    │  Real-time   │
                    └─────────────┘
```

---

## 2. Požiadavky na server

### Minimálne požiadavky
| Komponent | Požiadavka |
|-----------|------------|
| **Operačný systém** | Linux (Ubuntu 22.04+ odporúčaný), macOS, Windows WSL |
| **Node.js** | verzia 18 alebo novšia |
| **Bun** | najnovšia verzia (odporúčané) — https://bun.sh |
| **RAM** | minimálne 512 MB |
| **Disk** | minimálne 500 MB voľného miesta |
| **CPU** | 1 jadro |

### Odporúčané požiadavky pre produkciu
| Komponent | Požiadavka |
|-----------|------------|
| **Node.js** | verzia 20+ |
| **Bun** | najnovšia stabilná verzia |
| **RAM** | 1 GB+ |
| **Disk** | 1 GB+ |
| **CPU** | 2 jadrá |
| **Doména** | s SSL certifikátom (Let's Encrypt) |

---

## 3. Inštalácia

### Rýchla inštalácia (odporúčané)

```bash
# 1. Rozbaľte archív alebo klonujte repozitár
git clone https://github.com/jozinko6/spilka.git
cd spilka

# 2. Spustite inštalačný skript
chmod +x install.sh
./install.sh
```

Skript vás prevedie celou inštaláciou interaktívne.

### Manuálna inštalácia

```bash
# 1. Nainštalujte závislosti
bun install

# 2. Vytvorte .env súbor z predlohy
cp .env.example .env
# Upravte .env podľa potreby (pozri nižšie)

# 3. Vytvorte databázu
bun run db:push

# 4. Naplňte ukážkovými dátami
bun run seed

# 5. Vytvorte produkčnú verziu
bun run build

# 6. Spustite
bun run start
```

> 💡 **Tip:** Ak nemáte `bun`, môžete použiť `npm` ako náhradu — nahraďte `bun` za `npm` vo všetkých príkazoch vyššie.

### Súbor .env a .env.example

Projekt obsahuje súbor `.env.example` s predvolenými hodnotami. Po skopírovaní upravte podľa vášho prostredia:

| Premenná | Popis | Predvolená hodnota |
|----------|-------|--------------------|
| `DATABASE_URL` | Cesta k SQLite databáze | `file:./db/custom.db` |
| `PORT` | Port webového servera | `3000` |
| `NEXT_PUBLIC_SITE_URL` | Verejná URL stránky (pre SEO a zdieľanie) | `http://localhost:3000` |

Pre produkciu nastavte:
```env
DATABASE_URL=file:./db/custom.db
PORT=3000
NEXT_PUBLIC_SITE_URL=https://spilkaterasa.sk
```

Pre absolútnu cestu k databáze (odporúčané na VPS):
```env
DATABASE_URL=file:/var/www/spilka-terasa/db/custom.db
```

---

## 4. Spustenie

### Vývojársky režim (s automatickým obnovovaním)
```bash
bun run dev
```
Web bude dostupný na `http://localhost:3000`

### Produkčný režim
```bash
bun run build    # Vytvorenie optimalizovanej verzie
bun run start    # Spustenie produkčného servera
```

### Zmena portu
Upravte súbor `.env`:
```
PORT=8080
```
Alebo spustite priamo:
```bash
bunx next dev -p 8080      # vývojársky
bunx next start -p 8080    # produkčný
```

### Spustenie na pozadí (Linux)
```bash
# Pomocou nohup
nohup bun run start &> server.log &

# Alebo pomocou PM2 (odporúčané pre produkciu — pozri sekciu Nasadenie)
```

---

## 5. Admin panel

### Prístup
- **URL:** `https://vasa-domena.sk/admin`
- **Meno:** `admin`
- **Heslo:** `spilka2026`

> ⚠️ **Dôležité:** Zmente predvolené heslo po prvej prihlásení! Pozri [Zmena admin hesla](#zmena-admin-hesla).

### Záložky admin panela

| Záložka | Funkcia |
|---------|---------|
| **Jedálny lístok** | Pridávanie, úprava a mazanie položiek menu. Organizácia do kategórií. |
| **Ponuka dňa** | Nastavenie denného menu pre každý pracovný deň (pondelok - piatok). |
| **Akcie** | Správa akcií a udalostí (kvízy, živá hudba, atď.). |
| **Galéria** | Pridávanie a správa fotografií s popismi. |
| **Stoly** | Správa stolov pre objednávkový systém (číslo, názov, počet miest, zóna). Generovanie QR kódov. |
| **Objednávky** | Prehľad a správa objednávok zo stolov, zmena stavu objednávky v reálnom čase. |

### Práca s jedálnym lístkom

1. Kliknite na **Jedálny lístok**
2. Vyberte kategóriu (Polievky, Hlavné jedlá, atď.)
3. Kliknite **Pridať položku**
4. Vyplňte údaje:
   - **Názov** — názov jedla
   - **Popis** — krátky popis
   - **Cena** — vo formáte `9,90` (s čiarkou)
   - **Váha** — napr. `200 g` (voliteľné)
   - **Alergény** — čísla oddelené čiarkou, napr. `1, 3, 7` (voliteľné)
   - **Odznak** — napr. `Bestseller`, `Tip šéfkuchára` (voliteľné)
   - **Novinka** — zaškrtnite pre zvýraznenie
   - **Aktívny** — odškrtnite pre skrytie bez vymazania

### Práca s ponukou dňa

1. Kliknite na **Ponuka dňa**
2. Vyberte deň v týždni
3. Vyplňte:
   - **Polievka** — názov polievky
   - **Hlavné jedlo 1** — prvé hlavné jedlo
   - **Hlavné jedlo 2** — druhé hlavné jedlo
   - **Špecialita** — voliteľná špecialita dňa
   - **Alergény** pre každú položku

### Správa objednávok

1. Kliknite na **Objednávky**
2. Vidíte zoznam všetkých objednávok s stavmi:
   - 🔵 **Prijatá** — nová objednávka čaká na spracovanie
   - 🟡 **Pripravuje sa** — kuchyňa pripravuje jedlo
   - 🟢 **Pripravená** — jedlo je hotové na podávanie
   - ✅ **Podaná** — jedlo bolo doručené hosťovi
   - 💰 **Zaplatená** — objednávka je uhradená
   - ❌ **Zrušená** — objednávka bola zrušená
3. Kliknutím na tlačidlo stavu zmeníte stav objednávky
4. Nové objednávky sa zobrazia okamžite vďaka WebSocket pripojeniu
5. Počet aktívnych objednávok je zobrazený v bočnom menu ako odznak

---

## Zmena admin hesla

Heslo admin používateľa je uložené v SQLite databáze. Na jeho zmenu máte dve možnosti:

### Možnosť 1: Cez Prisma Studio (odporúčané)

```bash
# Spustite Prisma Studio — vizuálny editor databázy
bunx prisma studio
```

1. Otvorte **http://localhost:5555** v prehliadači
2. Kliknite na tabuľku **Admin**
3. Nájdite riadok s používateľom `admin`
4. Zmeňte hodnotu v stĺpci `password` na nové heslo
5. Kliknite **Save 1 change**

### Možnosť 2: Cez SQLite príkazový riadok

```bash
# Otvorte databázu
sqlite3 db/custom.db

# Zmente heslo (nahraďte 'noveHeslo123' vaším heslom)
UPDATE Admin SET password = 'noveHeslo123' WHERE username = 'admin';

# Ukončite
.quit
```

### Zmena autentizačného tokenu

Systém používa pevne definovaný token `spilka-admin-2026` pre API prístup. Ak chcete zvýšiť bezpečnosť:

1. Otvorte súbor `src/lib/admin-auth.ts`
2. Zmeňte hodnotu `ADMIN_TOKEN`:
   ```typescript
   const ADMIN_TOKEN = "vas-novy-tajny-token";
   ```
3. Otvorte súbor `src/app/api/admin/auth/route.ts`
4. Zmeňte hodnotu tokenu v odpovedi:
   ```typescript
   token: "vas-novy-tajny-token",
   ```
5. Znovu vytvorte build: `bun run build`

> ⚠️ Po zmene tokenu sa musíte znova prihlásiť do admin panela.

---

## 7. Prispôsobenie webstránky

### Zmena názvu reštaurácie a SEO

Upravte súbor `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://spilkaterasa.sk"),
  title: "VÁŠ NÁZOV | Podtitulok | Mesto",
  description: "Popis vašej reštaurácie...",
  keywords: ["kľúčové", "slová"],
  openGraph: {
    title: "VÁŠ NÁZOV",
    description: "Popis pre sociálne siete...",
    url: "https://vasa-domena.sk",
    siteName: "VÁŠ NÁZOV",
    // ...
  },
};
```

### Zmena farieb (farebná schéma)

Farby sú definované v súbore `src/app/globals.css` pomocou oklch farebného priestoru. Hlavné farby:

| Premenná | Popis | Predvolená hodnota |
|----------|-------|--------------------|
| `--color-amber-gold` | Zlatá/ambrová hlavná farba | `oklch(0.72 0.14 75)` |
| `--color-warm-dark` | Tmavý text a pozadia | `oklch(0.18 0.03 60)` |
| `--color-warm-cream` | Krémové svetlé pozadie | `oklch(0.97 0.01 75)` |
| `--accent` | Zvýrazňovacia farba (tlačidlá, odkazy) | `oklch(0.72 0.14 75)` |
| `--ring` | Farba orámovania focus | `oklch(0.72 0.14 75)` |

Príklad zmeny na modrú schému:
```css
:root {
  --accent: oklch(0.55 0.2 260);       /* modrá */
  --ring: oklch(0.55 0.2 260);
}
```

Príklad zmeny na zelenú schému:
```css
:root {
  --accent: oklch(0.55 0.15 155);      /* zelená */
  --ring: oklch(0.55 0.15 155);
}
```

> 💡 **Tip:** Oklch formát umožňuje jednoduchú zmenu farebného odtieňa zmenou posledného čísla (hue). Navštívte https://oklch.com pre vizuálny výber farieb.

### Zmena kontaktných údajov

Kontaktné informácie sú rozdelené na dve časti:

1. **Verejná stránka** — upravte komponenty v `src/components/`:
   - `contact.tsx` — telefon, email, adresa, otváracie hodiny
   - `footer.tsx` — pätička s kontaktmi a odkazmi na sociálne siete
   - `navigation.tsx` — logo a názov v navigácii

2. **SEO a meta údaje** — upravte `src/app/layout.tsx`:
   - `metadataBase`, `title`, `description`, `openGraph`

### Zmena odkazov na rozvoz (Wolt / Bolt Food)

Odkazy na rozvozové platformy nájdete v týchto komponentoch:
- `src/components/order-section.tsx` alebo `src/components/daily-menu.tsx` — sekcia rozvozu
- Upravte URL odkazy na vaše profilné stránky na Wolt a Bolt Food

### Výmena obrázkov

Obrázky sú uložené v priečinku `public/images/`. Nahraďte existujúce súbory novými (zachovajte názvy), alebo pridajte nové a aktualizujte cesty v galérii cez admin panel.

| Súbor | Popis | Odporúčaná veľkosť |
|-------|-------|--------------------|
| `spilka-hero.jpg` | Hlavný obrázok (hero sekcia) | 1344×768 px |
| `spilka-interior.jpg` | Interiér reštaurácie | 1344×768 px |
| `spilka-food.jpg` | Jedlo — špeciality | 1344×768 px |
| `spilka-dish.jpg` | Tradičné jedlá | 1344×768 px |
| `spilka-beer.jpg` | Pivo / Svijany 450 | 1344×768 px |
| `spilka-terrace.jpg` | Terasa | 1344×768 px |
| `spilka-tanks.jpg` | Pivné tanky | 1344×768 px |
| `spilka-event-room.jpg` | Spoločenská miestnosť | 1344×768 px |
| `spilka-facebook.jpg` | Obrázok pre zdieľanie na Facebooku (OG) | 1200×630 px |

> 💡 **Tip:** Pre optimálne načítavanie odporúčame obrázky pred nahrávaním komprimovať nástrojom ako https://squoosh.app.

---

## 8. Objednávkový systém pri stolu

### Ako to funguje

1. Hosť naskenuje **QR kód** na stole svojím telefónom
2. Otvorí sa mu **mobilná verzia jedálneho lístka**
3. Pridá položky do **košíka**, môže pridať poznámky
4. Odošle **objednávku** — tá sa okamžite zobrazí v admin paneli
5. Hosť vidí **real-time stav** objednávky na svojom telefóne
6. Personál mení stav objednávky — hosť vidí zmeny okamžite

### URL formát
```
https://vasa-domena.sk/order?table=ČÍSLO_STOLA
```

Príklady:
- Stôl 1: `https://vasa-domena.sk/order?table=1`
- Stôl 5: `https://vasa-domena.sk/order?table=5`
- VIP stôl 9: `https://vasa-domena.sk/order?table=9`

### Stavy objednávky
Hosť vidí na svojom telefóne priebeh objednávky:
```
Prijaté → Pripravuje sa → Pripravené → Podané
```

---

## 9. WebSocket objednávkový servis

WebSocket servis zabezpečuje real-time komunikáciu medzi objednávkovou stránkou hosťa a admin panelom. Beží ako samostatný proces na porte **3003**.

### Ako servis funguje

```
┌──────────────┐    new-order     ┌──────────────────┐
│  Hosť mobil  │─────────────────▶│  WebSocket servis │
│  /order      │                  │  (port 3003)      │
└──────────────┘                  └────────┬─────────┘
                                           │
┌──────────────┐   order-status-changed    │
│  Admin panel │◀──────────────────────────┘
│  /admin      │    new-order (broadcast)
└──────────────┘
       │
       │ order-status-update
       ▼
┌──────────────────┐
│  WebSocket servis │──▶ order-status-changed ──▶ Hosť mobil
└──────────────────┘
```

**Udalosti (events):**
| Udalosť | Smer | Popis |
|---------|------|-------|
| `join-admin` | Admin → Servis | Admin sa pripojí na príjem objednávok |
| `join-order` | Hosť → Servis | Hosť sleduje stav svojej objednávky |
| `new-order` | Hosť → Servis → Admin | Nová objednávka zo stola |
| `order-status-update` | Admin → Servis | Zmena stavu objednávky |
| `order-status-changed` | Servis → Hosť + Admin | Notifikácia o zmene stavu |

### Spustenie servisu

#### Vývojársky režim (s automatickým reloadom)
```bash
cd mini-services/order-service
bun install
bun run dev
```

#### Produkčný režim
```bash
cd mini-services/order-service
bun install
node index.ts
# alebo cez PM2:
pm2 start "node index.ts" --name "spilka-ws" --cwd /var/www/spilka-terasa/mini-services/order-service
```

### Overenie, či servis beží

```bash
# Skontrolujte, či proces beží
lsof -i :3003
# alebo
ss -tlnp | grep 3003

# Skontrolujte PM2 stav
pm2 status spilka-ws

# Otvorte v prehliadači — mala by sa zobraziť chybová stránka Socket.IO (normálne)
curl http://localhost:3003
# Očakávaná odpoveď: {"code":0,"message":"Transport unknown"}

# Skontrolujte logy
pm2 logs spilka-ws
# alebo
tail -f mini-services/order-service/service.log
```

### Dôležité poznámky

- **Servis MUSÍ bežať** pre správne fungovanie real-time objednávok
- Bez WebSocket servisu hosť nevidí zmeny stavu objednávky v reálnom čase
- Admin panel sa automaticky pripojí na WebSocket pri otvorení sekcie Objednávky
- CORS je nastavený na `*` — pre produkciu odporúčame obmedziť na vašu doménu v `mini-services/order-service/index.ts`
- Port 3003 je nastavený priamo v `mini-services/order-service/index.ts` — pri zmene aktualizujte aj Nginx konfiguráciu

---

## 10. Správa QR kódov

### Generovanie QR kódov

1. Prihláste sa do **Admin panela**
2. Prejdite na **Stoly**
3. Pre každý stôl kliknite na **Zobraziť QR**
4. Zobrazí sa QR kód a URL odkaz
5. Kliknite **Kopírovať odkaz** pre skopírovanie URL

### Ručné generovanie QR kódov

Môžete použiť ľubovoľný QR generátor (napr. https://qr.io) s URL:
```
https://vasa-domena.sk/order?table=1
```

### Tlač QR kódov pre stoly

Odporúčame vytlačiť QR kódy na kartón a umiestniť ich na každý stôl:
- Formát: minimálne 5×5 cm
- Obsahujú: QR kód + názov reštaurácie + číslo stola
- Umiestnenie: na stojanček, podložku alebo priamo na stôl

---

## 11. Nasadenie na produkciu

### Vercel (najjednoduchšie — s obmedzeniami)

1. Vytvorte účet na [vercel.com](https://vercel.com)
2. Pripojte váš GitHub repozitár: `https://github.com/jozinko6/spilka`
3. Vercel automaticky zistí Next.js a nasadí projekt
4. Nastavte environment variables:
   - `DATABASE_URL` = cesta k SQLite databáze
5. Po nasadení dostanete URL (možno pripojiť vlastnú doménu)

> ⚠️ **Poznámka:** Vercel je serverless platforma — SQLite nebude fungovať správne.
> Pre Vercel odporúčame prejsť na PostgreSQL (supabase.com ponúka free tier).
> WebSocket servis nepôjde na Verceli — je potrebný vlastný VPS.

### Vlastný VPS server (odporúčané pre plnú funkčnosť)

#### Krok 1: Príprava servera

```bash
# Nainštalujte Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Nainštalujte Bun
curl -fsSL https://bun.sh/install | bash

# Nainštalujte PM2
sudo npm install -g pm2

# Nainštalujte Nginx
sudo apt-get install -y nginx

# Nainštalujte SQLite (ak nie je)
sudo apt-get install -y sqlite3
```

#### Krok 2: Nasadenie aplikácie

```bash
# Vytvorte adresár
sudo mkdir -p /var/www/spilka-terasa
sudo chown $USER:$USER /var/www/spilka-terasa

# Klonujte repozitár
cd /var/www/spilka-terasa
git clone https://github.com/jozinko6/spilka.git .

# Nainštalujte závislosti
bun install

# Vytvorte .env súbor
cp .env.example .env
# Upravte .env — nastavte NEXT_PUBLIC_SITE_URL a DATABASE_URL

# Vytvorte databázu a naplňte dátami
bun run db:push
bun run seed

# Vytvorte produkčný build
bun run build

# Vytvorte adresár pre zálohy
mkdir -p db/backup
```

#### Krok 3: Spustenie cez PM2

```bash
# Spustenie hlavnej aplikácie
pm2 start "bun run start" --name "spilka" --cwd /var/www/spilka-terasa

# Spustenie WebSocket servisu
cd /var/www/spilka-terasa/mini-services/order-service
bun install
pm2 start "node index.ts" --name "spilka-ws" --cwd /var/www/spilka-terasa/mini-services/order-service

# Uložte zoznam procesov
pm2 save

# Nastavte automatické spustenie po reštarte servera
pm2 startup
# PM2 vypíše príkaz, ktorý treba skopírovať a spustiť (s sudo)
```

#### Krok 4: Overenie

```bash
# Skontrolujte stav procesov
pm2 status

# Mali by ste vidieť:
# ┌─────┬──────────┬─────────┐
# │ id  │ name     │ status  │
# ├─────┼──────────┼─────────┤
# │ 0   │ spilka   │ online  │
# │ 1   │ spilka-ws│ online  │
# └─────┴──────────┴─────────┘

# Skontrolujte logy
pm2 logs

# Otestujte web
curl http://localhost:3000

# Otestujte WebSocket servis
curl http://localhost:3003
```

#### Krok 5: Nginx konfigurácia

Vytvorte súbor `/etc/nginx/sites-available/spilka-terasa`:

```nginx
server {
    listen 80;
    server_name vasa-domena.sk www.vasa-domena.sk;

    # Hlavná aplikácia (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket servis (Socket.IO)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
```

```bash
# Aktivujte konfiguráciu
sudo ln -s /etc/nginx/sites-available/spilka-terasa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Krok 6: SSL certifikát (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d vasa-domena.sk -d www.vasa-domena.sk
```

Certbot automaticky upraví Nginx konfiguráciu a nastaví presmerovanie na HTTPS.

#### Užitočné PM2 príkazy

```bash
pm2 status                    # Zobraziť stav všetkých procesov
pm2 logs spilka               # Zobraziť logy hlavnej aplikácie
pm2 logs spilka-ws            # Zobraziť logy WebSocket servisu
pm2 restart spilka            # Reštartovať hlavnú aplikáciu
pm2 restart spilka-ws         # Reštartovať WebSocket servis
pm2 restart all               # Reštartovať všetko
pm2 stop spilka               # Zastaviť aplikáciu
pm2 delete spilka             # Odstrániť aplikáciu z PM2
pm2 monit                     # Interaktívny monitor (CPU, RAM)
pm2 describe spilka           # Detailné informácie o procese
```

---

## 12. Údržba a zálohy

### Záloha databázy

```bash
# Vytvorte zálohu
cp db/custom.db db/backup/custom_$(date +%Y%m%d_%H%M%S).db

# Alebo automaticky cez cron (každý deň o 2:00)
crontab -e
# Pridajte:
0 2 * * * cp /var/www/spilka-terasa/db/custom.db /var/www/spilka-terasa/db/backup/custom_$(date +\%Y\%m\%d).db
```

### Obnova databázy

```bash
# Zastavte server
pm2 stop spilka

# Obnovte zálohu
cp db/backup/custom_20260509.db db/custom.db

# Reštartujte server
pm2 start spilka
```

### Aktualizácia systému

```bash
# 1. Zálohujte databázu!
cp db/custom.db db/backup/custom_before_update.db

# 2. Stiahnite novú verziu
git pull origin main

# 3. Nainštalujte závislosti
bun install

# 4. Aktualizujte databázovú schému
bun run db:push

# 5. Vytvorte nový build
bun run build

# 6. Reštartujte
pm2 restart spilka

# 7. Reštartujte aj WebSocket servis (ak sa zmenil)
cd mini-services/order-service && bun install
pm2 restart spilka-ws
```

---

## 13. Riešenie problémov

| Problém | Riešenie |
|---------|----------|
| **Web sa nenačítava** | Skontrolujte, či beží server: `pm2 status` alebo `curl localhost:3000` |
| **Chyba databázy** | Skontrolujte `DATABASE_URL` v `.env` a práva na súbor `db/custom.db` |
| **Admin prihlásenie nefunguje** | Skontrolujte, či existuje admin účet: `bun run seed` (pozor, prepíše dáta!) |
| **QR kód nefunguje** | Skontrolujte, či stôl existuje v admin paneli pod záložkou Stoly |
| **Objednávka nepríde** | Skontrolujte, či beží WebSocket servis: `lsof -i :3003` alebo `pm2 status` |
| **Real-time nefunguje** | Skontrolujte WebSocket servis a Nginx konfiguráciu pre `/socket.io/` |
| **Obrázky sa nezobrazujú** | Skontrolujte priečinok `public/images/` a práva na súbory |
| **Pomalé načítavanie** | Spustite produkčný build: `bun run build && pm2 restart spilka` |
| **PM2 sa nespustí po reštarte** | Spustite `pm2 startup` a nasledujte inštrukcie |
| **Chyba "findMany is not a function"** | Regenerujte Prisma klienta: `bun run db:generate` a reštartujte |
| **Port 3000 je obsadený** | Upravte `PORT` v `.env` alebo ukončite proces: `lsof -i :3000` |

### Reštartovanie služieb

```bash
# PM2
pm2 restart spilka
pm2 restart spilka-ws

# Alebo manuálne
pkill -f "next"
bun run start &
```

### Logy

```bash
# PM2 logy
pm2 logs spilka          # hlavná aplikácia
pm2 logs spilka-ws       # WebSocket servis
pm2 logs                 # všetky logy

# Manuálne logy
tail -f server.log
```

### Úplný reštart (núdzový)

```bash
pm2 delete all
bun run build
pm2 start "bun run start" --name "spilka" --cwd /var/www/spilka-terasa
pm2 start "node index.ts" --name "spilka-ws" --cwd /var/www/spilka-terasa/mini-services/order-service
pm2 save
```

---

## 14. Technická špecifikácia

### Technológie

| Technológia | Verzia | Účel |
|-------------|--------|------|
| Next.js | 16 | React framework s App Router |
| React | 19 | UI knižnica |
| TypeScript | 5 | Typový jazyk |
| Tailwind CSS | 4 | Štýlovanie |
| Prisma | 6 | ORM pre databázu |
| SQLite | — | Databáza |
| Socket.IO | 4 | Real-time komunikácia |
| Framer Motion | 12 | Animácie |
| shadcn/ui | — | UI komponenty |
| Lucide | — | Ikony |
| Zustand | 5 | Stavový manažment (admin) |
| Bun | — | Runtime a balíčkovací manažér |

### Databázová schéma

```
Admin         → Prihlasovanie do admin panela
MenuCategory  → Kategórie jedálneho lístka (1:N → MenuItem)
MenuItem      → Položky menu
DailyMenu     → Denné menu (1 deň = 1 záznam)
Event         → Akcie a udalosti
GalleryImage  → Fotografie galérie
Table         → Stoly v reštaurácii
Order         → Objednávky (1:N → OrderItem)
OrderItem     → Položky objednávky
```

### API endpointy

| Metóda | URL | Popis |
|--------|-----|-------|
| GET | `/api/menu` | Získať jedálny lístok |
| GET | `/api/daily-menu` | Získať ponuku dňa |
| GET | `/api/events` | Získať akcie |
| GET | `/api/gallery` | Získať galériu |
| GET | `/api/tables` | Získať stoly |
| POST | `/api/orders` | Vytvoriť objednávku |
| GET | `/api/orders/[id]` | Detail objednávky |
| POST | `/api/contact` | Odoslať kontaktný formulár |
| POST | `/api/admin/auth` | Prihlásenie do admina |
| GET/POST | `/api/admin/menu-categories` | CRUD kategórií |
| GET/POST | `/api/admin/menu-items` | CRUD položiek menu |
| PUT/DELETE | `/api/admin/menu-items/[id]` | Úprava/mazanie položky |
| GET/POST | `/api/admin/daily-menu` | CRUD denného menu |
| PUT/DELETE | `/api/admin/daily-menu/[id]` | Úprava/mazanie denného menu |
| GET/POST | `/api/admin/events` | CRUD akcií |
| PUT/DELETE | `/api/admin/events/[id]` | Úprava/mazanie akcie |
| GET/POST | `/api/admin/gallery` | CRUD galérie |
| PUT/DELETE | `/api/admin/gallery/[id]` | Úprava/mazanie obrázka |
| GET/POST | `/api/admin/tables` | CRUD stolov |
| PUT/DELETE | `/api/admin/tables/[id]` | Úprava/mazanie stola |
| GET/POST | `/api/admin/orders` | CRUD objednávok |
| PUT/DELETE | `/api/admin/orders/[id]` | Úprava/mazanie objednávky |

### Štruktúra projektu

```
spilka-terasa/
├── prisma/
│   ├── schema.prisma      # Databázová schéma
│   └── seed.ts            # Ukážkové dáta
├── db/
│   ├── custom.db          # SQLite databáza
│   └── backup/            # Zálohy databázy
├── public/
│   ├── images/            # Obrázky (hero, jedlo, interiér, ...)
│   └── logo.svg           # Logo reštaurácie
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Hlavný layout (SEO, meta, fonty)
│   │   ├── globals.css    # Globálne štýly a farby
│   │   ├── page.tsx       # Hlavná stránka
│   │   ├── admin/         # Admin panel (page.tsx)
│   │   ├── order/         # Objednávková stránka (page.tsx)
│   │   └── api/           # API routes
│   │       ├── admin/     # Admin API (auth, CRUD)
│   │       ├── menu/      # Verejný jedálny lístok
│   │       ├── daily-menu/# Verejná ponuka dňa
│   │       ├── events/    # Verejné akcie
│   │       ├── gallery/   # Verejná galéria
│   │       ├── tables/    # Verejné stoly
│   │       ├── orders/    # Objednávky
│   │       └── contact/   # Kontaktný formulár
│   ├── components/        # React komponenty
│   │   ├── ui/            # shadcn/ui komponenty
│   │   ├── admin/         # Admin komponenty
│   │   │   ├── admin-login.tsx
│   │   │   ├── admin-layout.tsx
│   │   │   ├── admin-menu.tsx
│   │   │   ├── admin-daily-menu.tsx
│   │   │   ├── admin-events.tsx
│   │   │   ├── admin-gallery.tsx
│   │   │   ├── admin-tables.tsx
│   │   │   └── admin-orders.tsx
│   │   ├── navigation.tsx
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── food-menu.tsx
│   │   ├── daily-menu.tsx
│   │   ├── beer-section.tsx
│   │   ├── menu-highlights.tsx
│   │   ├── order-section.tsx
│   │   ├── events-section.tsx
│   │   ├── gallery.tsx
│   │   ├── contact.tsx
│   │   ├── section-wrapper.tsx
│   │   └── footer.tsx
│   ├── lib/
│   │   ├── db.ts          # Prisma klient
│   │   ├── admin-auth.ts  # Admin autentizácia (token)
│   │   ├── admin-store.ts # Zustand stav admina
│   │   └── utils.ts       # Pomocné funkcie
│   └── hooks/             # React hooky
├── mini-services/
│   └── order-service/     # WebSocket servis (Socket.IO, port 3003)
│       ├── index.ts
│       └── package.json
├── .env                   # Environment premenné (NEVERZUJTE!)
├── .env.example           # Predloha pre .env
├── install.sh             # Inštalačný skript
├── MANUAL.md              # Tento manuál
├── Caddyfile              # Caddy webserver konfigurácia (alternatíva k Nginx)
└── package.json
```

---

## 15. História verzií

| Verzia | Dátum | Zmeny |
|--------|-------|-------|
| **1.1.0** | 5. 3. 2026 | Vylepšený manuál: Quick Start sekcia, zmena admin hesla, prispôsobenie webu, WebSocket servis detail, PM2 návod, .env.example info, rozšírené API endpointy, verzia a dátum |
| **1.0.0** | — | Počiatočná verzia: Prezentáčný web, admin panel, objednávkový systém, QR kódy, real-time objednávky |

---

## 📞 Podpora

Pre technickú podporu kontaktujte vývojára.

**Licencia:** Projekt je dodávaný ako súčasť kúpy. Úpravy a redistribúcia len so súhlasom autora.
