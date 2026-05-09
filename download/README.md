# SPILKA Terasa — Balík na stiahnutie

Tento priečinok obsahuje archív kompletného projektu pre distribúciu.

## Súbory

| Súbor | Veľkosť | Popis |
|-------|---------|-------|
| `spilka-terasa-v1.1.0.tar.gz` | ~12 MB | Kompletný projekt (bez node_modules, .next, databázy) |

## Inštalácia z archívu

```bash
# 1. Rozbaľte archív
tar xzf spilka-terasa-v1.1.0.tar.gz -C spilka-terasa
cd spilka-terasa

# 2. Skopírujte konfiguráciu
cp .env.example .env

# 3. Spustite inštalačný skript
chmod +x install.sh
./install.sh
```

## Dokumentácia

- **MANUAL.md** — Kompletný manuál pre prevádzkovateľa
- **PREDAJCA.md** — Dokument pre predajcu (handover dokument)
- **install.sh** — Automatický inštalačný skript

## Alternatíva: Inštalácia z GitHub

```bash
git clone https://github.com/jozinko6/spilka.git spilka-terasa
cd spilka-terasa
cp .env.example .env
chmod +x install.sh
./install.sh
```
