# SPILKA Terasa — Manuál pre prevádzkovateľa

## 📋 Obsah

1. [Prehľad systému](#1-prehľad-systému)
2. [Požiadavky na server](#2-požiadavky-na-server)
3. [Inštalácia](#3-inštalácia)
4. [Spustenie](#4-spustenie)
5. [Admin panel](#5-admin-panel)
6. [Objednávkový systém pri stolu](#6-objednávkový-systém-pri-stolu)
7. [Správa QR kódov](#7-správa-qr-kódov)
8. [Nasadenie na produkciu](#8-nasadenie-na-produkciu)
9. [Údržba a zálohy](#9-údržba-a-zálohy)
10. [Riešenie problémov](#10-riešenie-problémov)
11. [Technická špecifikácia](#11-technická-špecifikácia)

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
| **Real-time notifikácie** | Okamžité oznámenia o nových objednávkach pre kuchyňu |
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
| **RAM** | minimálne 512 MB |
| **Disk** | minimálne 500 MB voľného miesta |
| **CPU** | 1 jadro |

### Odporúčané požiadavky pre produkciu
| Komponent | Požiadavka |
|-----------|------------|
| **Node.js** | verzia 20+ |
| **RAM** | 1 GB+ |
| **Disk** | 1 GB+ |
| **CPU** | 2 jadrá |
| **Doména** | s SSL certifikátom (Let's Encrypt) |

---

## 3. Inštalácia

### Rýchla inštalácia (odporúčané)

```bash
# 1. Rozbaľte archív
unzip spilka-terasa.zip
cd spilka-terasa

# 2. Spustite inštalačný skript
chmod +x install.sh
./install.sh
```

Skript vás prevedie celou inštaláciou interaktívne.

### Manuálna inštalácia

```bash
# 1. Nainštalujte závislosti
npm install

# 2. Vytvorte .env súbor
cp .env.example .env
# Upravte .env podľa potreby

# 3. Vytvorte databázu
npm run db:push

# 4. Naplňte ukážkovými dátami
npm run seed

# 5. Vytvorte produkčnú verziu
npm run build

# 6. Spustite
npm run start
```

---

## 4. Spustenie

### Vývojársky režim (s automatickým obnovovaním)
```bash
npm run dev
```
Web bude dostupný na `http://localhost:3000`

### Produkčný režim
```bash
npm run build    # Vytvorenie optimalizovanej verzie
npm run start    # Spustenie produkčného servera
```

### Zmena portu
Upravte súbor `.env`:
```
PORT=8080
```
Alebo spustite priamo:
```bash
npx next dev -p 8080      # vývojársky
npx next start -p 8080    # produkčný
```

### Spustenie na pozadí (Linux)
```bash
# Pomocou nohup
nohup npm run start &> server.log &

# Alebo pomocou PM2 (odporúčané pre produkciu)
npm install -g pm2
pm2 start npm --name "spilka" -- start
pm2 save
pm2 startup    # automatické spustenie po reštarte servera
```

---

## 5. Admin panel

### Prístup
- **URL:** `http://vasa-domena.sk/admin`
- **Meno:** `admin`
- **Heslo:** `spilka2026`

> ⚠️ **Dôležité:** Zmente predvolené heslo po prvej prihlásení!

### Záložky admin panela

| Záložka | Funkcia |
|---------|---------|
| **Jedálny lístok** | Pridávanie, úprava a mazanie položiek menu. Organizácia do kategórií. |
| **Ponuka dňa** | Nastavenie denného menu pre každý pracovný deň (pondelok - piatok). |
| **Akcie** | Správa akcií a udalostí (kvízy, živá hudba, atď.). |
| **Galéria** | Pridávanie a správa fotografií s popismi. |
| **Stoly** | Správa stolov pre objednávkový systém (číslo, názov, počet miest, zóna). |
| **Objednávky** | Prehľad a správa objednávok zo stolov, zmena stavu objednávky. |

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
3. Kliknutím na objednávku zobrazíte detail a môžete zmeniť stav

---

## 6. Objednávkový systém pri stolu

### Ako to funguje

1. Hosť naskenuje **QR kód** na stole svojím telefónom
2. Otvorí sa mu **mobilná verzia jedálneho lístka**
3. Pridá položky do **košíka**, môže pridať poznámky
4. Odošle **objednávku** — tá sa okamžite zobrazí v admin paneli
5. Hosť vidí **real-time stav** objednávky na svojom telefóne
6. Personál mení stav objednávky — hosť vidí zmeny okamžite

### URL formát
```
http://vasa-domena.sk/order?table=ČÍSLO_STOLA
```

Príklady:
- Stôl 1: `http://vasa-domena.sk/order?table=1`
- Stôl 5: `http://vasa-domena.sk/order?table=5`
- VIP stôl 9: `http://vasa-domena.sk/order?table=9`

### Stavy objednávky
Hosť vidí na svojom telefóne priebeh objednávky:
```
Prijaté → Pripravuje sa → Pripravené → Podané
```

---

## 7. Správa QR kódov

### Generovanie QR kódov

1. Prihláste sa do **Admin panela**
2. Prejdite na **Stoly**
3. Pre každý stôl je zobrazený QR kód
4. Kliknite na **Tlačiť QR kódy** pre hromadný tlač

### Ručné generovanie QR kódov

Môžete použiť ľubovoľný QR generátor (napr. https://qr.io) s URL:
```
http://vasa-domena.sk/order?table=1
```

### Tlač QR kódov pre stoly

Odporúčame vytlačiť QR kódy na kartón a umiestniť ich na každý stôl:
- Formát: minimálne 5×5 cm
- Obsahujú: QR kód + názov reštaurácie + číslo stola
- Umiestnenie: na stojanček, podložku alebo priamo na stôl

---

## 8. Nasadenie na produkciu

### Vercel (odporúčané — najjednoduchšie)

1. Vytvorte účet na [vercel.com](https://vercel.com)
2. Pripojte váš GitHub repozitár
3. Vercel automaticky zistí Next.js a nasadí projekt
4. Nastavte environment variables:
   - `DATABASE_URL` = cesta k SQLite databáze
5. Po nasadení dostanete URL (možno pripojiť vlastnú doménu)

> ⚠️ **Poznámka:** Vercel je serverless platforma — SQLite nebude fungovať.
> Pre Vercel odporúčame prejsť na PostgreSQL (supabase.com ponúka free tier).

### Vlastný VPS server

```bash
# 1. Nainštalujte Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# 2. Nainštalujte PM2
sudo npm install -g pm2

# 3. Rozbaľte projekt a nainštalujte
cd /var/www/spilka-terasa
npm install
npm run build
npm run db:push
npm run seed

# 4. Spustite s PM2
pm2 start npm --name "spilka" -- start
pm2 save
pm2 startup

# 5. Spustite WebSocket servis
cd mini-services/order-service
npm install
pm2 start npm --name "spilka-ws" -- dev
pm2 save

# 6. Nastavte Nginx reverse proxy
sudo apt-get install nginx
```

### Nginx konfigurácia

```nginx
server {
    listen 80;
    server_name vasa-domena.sk;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket servis
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### SSL certifikát (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d vasa-domena.sk
```

---

## 9. Údržba a zálohy

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
npm install

# 4. Aktualizujte databázovú schému
npm run db:push

# 5. Vytvorte nový build
npm run build

# 6. Reštartujte
pm2 restart spilka
```

---

## 10. Riešenie problémov

| Problém | Riešenie |
|---------|----------|
| **Web sa nenačítava** | Skontrolujte, či beží server: `pm2 status` alebo `curl localhost:3000` |
| **Chyba databázy** | Skontrolujte `DATABASE_URL` v `.env` a práva na súbor |
| **Admin prihlásenie nefunguje** | Skontrolujte, či existuje admin účet: `npm run seed` |
| **QR kód nefunguje** | Skontrolujte, či stôl existuje v admin paneli pod záložkou Stoly |
| **Objednávka nepríde** | Skontrolujte, či beží WebSocket servis na porte 3003 |
| **Obrázky sa nezobrazujú** | Skontrolujte priečinok `public/images/` |
| **Pomalé načítavanie** | Spustite produkčný build: `npm run build && npm run start` |

### Reštartovanie služieb

```bash
# PM2
pm2 restart spilka
pm2 restart spilka-ws

# Alebo manuálne
pkill -f "next"
npx next start -p 3000 &
```

### Logy

```bash
# PM2 logy
pm2 logs spilka

# Manuálne logy
tail -f server.log
tail -f dev.log
```

---

## 11. Technická špecifikácia

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
| GET/POST | `/api/admin/*` | CRUD operácie pre admina |

### Štruktúra projektu

```
spilka-terasa/
├── prisma/
│   ├── schema.prisma      # Databázová schéma
│   └── seed.ts            # Ukážkové dáta
├── db/
│   └── custom.db          # SQLite databáza
├── public/
│   └── images/            # Obrázky (hero, jedlo, interiér, ...)
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Hlavný layout
│   │   ├── page.tsx       # Hlavná stránka
│   │   ├── admin/         # Admin panel
│   │   ├── order/         # Objednávková stránka
│   │   └── api/           # API routes
│   ├── components/        # React komponenty
│   │   ├── ui/            # shadcn/ui komponenty
│   │   ├── admin/         # Admin komponenty
│   │   ├── navigation.tsx
│   │   ├── hero.tsx
│   │   ├── food-menu.tsx
│   │   ├── daily-menu.tsx
│   │   ├── beer-section.tsx
│   │   ├── order-section.tsx
│   │   ├── events-section.tsx
│   │   ├── gallery.tsx
│   │   ├── contact.tsx
│   │   └── footer.tsx
│   └── lib/
│       └── db.ts          # Prisma klient
├── mini-services/
│   └── order-service/     # WebSocket servis
├── .env                   # Environment premenné
├── install.sh             # Inštalačný skript
├── MANUAL.md              # Tento manuál
└── package.json
```

---

## 📞 Podpora

Pre technickú podporu kontaktujte vývojára.

**Licencia:** Projekt je dodávaný ako súčasť kúpy. Úpravy a redistribúcia len so súhlasom autora.
