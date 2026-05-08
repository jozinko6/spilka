import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.galleryImage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.dailyMenu.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.admin.deleteMany();

  // ─── Admin ────────────────────────────────────────────────────
  await prisma.admin.create({
    data: {
      username: "admin",
      password: "spilka2026",
    },
  });
  console.log("Created admin user");

  // ─── Menu Categories + Items ──────────────────────────────────
  const polievky = await prisma.menuCategory.create({
    data: {
      title: "Polievky",
      slug: "polievky",
      icon: "Soup",
      order: 0,
      items: {
        createMany: {
          data: [
            {
              name: "Slepačí vývar s rezancami a mäsom",
              description: "Tradičný vývar s koreňovou zeleninou, domácimi rezancami a kúskami mäsa",
              price: "3,49",
              weight: "0,33 l",
              allergens: "1, 3, 9",
              order: 0,
            },
            {
              name: "Tradičná Jókai fazuľová polievka",
              description: "Krémová fazuľová polievka s pivným praclíkom a kyslou smotanou",
              price: "6,40",
              weight: "0,33 l",
              allergens: "1, 3, 9",
              badge: "Obľúbené",
              order: 1,
            },
            {
              name: "Krémová polievka z medvedieho cesnaku",
              description: "Sezónna špecialita z čerstvého medvedieho cesnaku s krutónmi",
              price: "5,00",
              weight: "0,33 l",
              allergens: "7, 9",
              badge: "Sezónne",
              order: 2,
            },
            {
              name: "Cesnakový krém so syrovým krutónom",
              description: "Krémová cesnaková polievka s chrumkavým syrovým krutónom",
              price: "3,99",
              weight: "0,25 l",
              allergens: "1, 3, 7, 9",
              order: 3,
            },
            {
              name: "Gulášová polievka s chlebom",
              description: "Hustá gulášová polievka s kúskami mäsa a čerstvým chlebom",
              price: "3,99",
              weight: "0,25 l",
              allergens: "1, 3, 7, 9",
              order: 4,
            },
          ],
        },
      },
    },
  });
  console.log("Created Polievky category with items");

  const hlavne = await prisma.menuCategory.create({
    data: {
      title: "Hlavné jedlá",
      slug: "hlavne",
      icon: "UtensilsCrossed",
      order: 1,
      items: {
        createMany: {
          data: [
            {
              name: 'Rezňové "stripy"',
              description: "Podľa výberu bravčové alebo kuracie mäso, chrumkavé obalené prsia s prílohou",
              price: "8,90",
              weight: "200 g",
              allergens: "1, 3",
              order: 0,
            },
            {
              name: "Kurací steak na bylinkovom masle",
              description: "Grilovaný kurací steak s pečenými baby zemiakmi a bylinkovým maslom",
              price: "9,90",
              weight: "120/200 g",
              allergens: "7",
              order: 1,
            },
            {
              name: "Kuracie obaľované krídla",
              description: "Chrumkavé kuracie krídla s varenými zemiakmi alebo hranolkami a tzatziki dipom",
              price: "9,50",
              weight: "250 g",
              allergens: "1, 3, 7",
              order: 2,
            },
            {
              name: "Francúzske zemiaky",
              description: "Tradičné francúzske zemiaky so šunkou, syrom a kyslou smotanou",
              price: "7,90",
              weight: "300 g",
              allergens: "1, 3, 7, 12",
              order: 3,
            },
            {
              name: "Bravčová panenka so slivkovou omáčkou",
              description: "Grilovaná bravčová panenka s domácou slivkovou omáčkou a opekanými zemiakmi",
              price: "11,90",
              weight: "150 g",
              allergens: "1, 7",
              badge: "Tip šéfkuchára",
              order: 4,
            },
            {
              name: "Pečené kuracie stehno so žemľovou plnkou",
              description: "Dusené kuracie stehno s tradičnou žemľovou plnkou a dusenou ryžou",
              price: "8,50",
              weight: "250 g",
              allergens: "1, 3, 7",
              order: 5,
            },
          ],
        },
      },
    },
  });
  console.log("Created Hlavné jedlá category with items");

  const spilkaSpeciality = await prisma.menuCategory.create({
    data: {
      title: "Spilka špeciality",
      slug: "spilka-speciality",
      icon: "Star",
      order: 2,
      items: {
        createMany: {
          data: [
            {
              name: "Hovädzí burger s hranolkami a chedar omáčkou",
              description: "Ručne tvarovaný hovädzí burger s ľadovým šalátom, cibuľkou a horčicovou omáčkou",
              price: "13,90",
              weight: "120/150 g",
              allergens: "1, 3, 7, 10, 11",
              badge: "Bestseller",
              order: 0,
            },
            {
              name: "Jemne pikantné kuracie krídla s hranolkami",
              description: "Marinované kuracie krídla v pikantnej omáčke s chrumkavými hranolkami",
              price: "11,90",
              weight: "250/150 g",
              allergens: "1, 3",
              isNew: true,
              order: 1,
            },
            {
              name: "Grilovaný flank steak s chimichurri",
              description: "Hovädzí flank steak s domácim chimichurri a opekanými zemiakmi",
              price: "15,90",
              weight: "200 g",
              allergens: "7",
              badge: "Tip šéfkuchára",
              order: 2,
            },
            {
              name: "SPILKA rezeň",
              description: "Naša vlastná verzia klasického rezňa — extra tenký, chrumkavý a šťavnatý",
              price: "10,90",
              weight: "200 g",
              allergens: "1, 3",
              order: 3,
            },
          ],
        },
      },
    },
  });
  console.log("Created Spilka špeciality category with items");

  const flammkuchen = await prisma.menuCategory.create({
    data: {
      title: "Flammkuchen",
      slug: "flammkuchen",
      icon: "Flame",
      order: 3,
      items: {
        createMany: {
          data: [
            {
              name: "Flammkuchen slanina, cibuľa",
              description: "Tradičný flammkuchen s chrumkavou slaninou a karamelizovanou cibuľou",
              price: "9,90",
              weight: "250 g",
              allergens: "1, 3, 7, 12",
              badge: "Klasika",
              order: 0,
            },
            {
              name: "Flammkuchen paradajky, rukola",
              description: "Vegetariánsky flammkuchen so čerstvými paradajkami a rukolou",
              price: "9,90",
              weight: "250 g",
              allergens: "1, 3, 7",
              order: 1,
            },
            {
              name: "Flammkuchen s jablkami a škoricou",
              description: "Sladký flammkuchen s jablkami, škoricou a práškovým cukrom",
              price: "8,90",
              weight: "250 g",
              allergens: "1, 3, 7",
              isNew: true,
              order: 2,
            },
          ],
        },
      },
    },
  });
  console.log("Created Flammkuchen category with items");

  const salaty = await prisma.menuCategory.create({
    data: {
      title: "Šaláty",
      slug: "salaty",
      icon: "Salad",
      order: 4,
      items: {
        createMany: {
          data: [
            {
              name: "Cézar šalát s kuracím mäsom",
              description: "Čerstvý ľadový šalát s grilovaným kuracím mäsom, parmazánom a croutonmi",
              price: "9,90",
              weight: "300 g",
              allergens: "1, 3, 7, 12",
              order: 0,
            },
            {
              name: "Grécky šalát",
              description: "Klasický grécky šalát s feta syrom, olivami a čerstvou zeleninou",
              price: "7,90",
              weight: "280 g",
              allergens: "7",
              order: 1,
            },
            {
              name: "Šalát s grilovaným hermelínom",
              description: "Mix šalátov s grilovaným hermelínom, orechami a brusnicami",
              price: "9,50",
              weight: "280 g",
              allergens: "1, 3, 7, 8",
              badge: "Obľúbené",
              order: 2,
            },
          ],
        },
      },
    },
  });
  console.log("Created Šaláty category with items");

  const prilohy = await prisma.menuCategory.create({
    data: {
      title: "Prílohy & Dezerty",
      slug: "prilohy",
      icon: "Utensils",
      order: 5,
      items: {
        createMany: {
          data: [
            {
              name: "Hranolky",
              description: "Chrumkavé zemiakové hranolky",
              price: "2,90",
              weight: "200 g",
              allergens: "1",
              order: 0,
            },
            {
              name: "Batátové hranolky",
              description: "Sladké batátové hranolky",
              price: "3,50",
              weight: "200 g",
              allergens: "1",
              order: 1,
            },
            {
              name: "Cibuľové krúžky s dipom",
              description: "Chrumkavé cibuľové krúžky s dipom podľa výberu",
              price: "3,90",
              weight: "200 g",
              allergens: "1, 3, 10, 12",
              order: 2,
            },
            {
              name: "Varené zemiaky na masle",
              description: "Mäkké varené zemiaky s maslom a petržlenovou vňaťou",
              price: "2,50",
              weight: "200 g",
              allergens: "7",
              order: 3,
            },
            {
              name: "Opekané zemiaky",
              description: "Opekané zemiaky s cibuľou a slaninou",
              price: "3,50",
              weight: "200 g",
              allergens: "1, 7",
              order: 4,
            },
            {
              name: "Domáci čokoládový koláč",
              description: "Belgický čokoládový koláč s vanilkovou zmrzlinou",
              price: "4,90",
              weight: "150 g",
              allergens: "1, 3, 7, 8",
              order: 5,
            },
            {
              name: "Palačinky s tvarohom",
              description: "Jemné palačinky plnené sladkým tvarohom a ovocím",
              price: "4,50",
              weight: "200 g",
              allergens: "1, 3, 7",
              order: 6,
            },
          ],
        },
      },
    },
  });
  console.log("Created Prílohy & Dezerty category with items");

  // ─── Daily Menu ─────────────────────────────────────────────
  await prisma.dailyMenu.createMany({
    data: [
      {
        dayOfWeek: 1,
        soup: "Slepačí vývar s rezancami a mäsom",
        soupAllergens: "1,3,9",
        main1: "Bravčový rezeň so zemiakovým šalátom",
        main1Allergens: "1,3,7,10",
        main2: "Kurací steak na bylinkovom masle s opekanými zemiakmi",
        main2Allergens: "7",
        special: "Hovädzí burger s hranolkami a chedar omáčkou",
        specialAllergens: "1,3,7,10,11",
      },
      {
        dayOfWeek: 2,
        soup: "Gulášová polievka s chlebom",
        soupAllergens: "1,3,7,9",
        main1: "Francúzske zemiaky so šunkou a syrom",
        main1Allergens: "1,3,7,12",
        main2: "Kuracie obaľované krídla s varenými zemiakmi a tzatziki",
        main2Allergens: "1,3,7",
        special: "Flammkuchen slanina, cibuľa",
        specialAllergens: "1,3,7,12",
      },
      {
        dayOfWeek: 3,
        soup: "Krémová polievka z medvedieho cesnaku",
        soupAllergens: "7,9",
        main1: "Pečené kuracie stehno so žemľovou plnkou a dusenou ryžou",
        main1Allergens: "1,3,7",
        main2: 'Rezňové "stripy" — bravčové s hranolkami',
        main2Allergens: "1,3",
        special: "Grilovaná bravčová panenka so slivkovou omáčkou",
        specialAllergens: "1,7",
      },
      {
        dayOfWeek: 4,
        soup: "Tradičná Jókai fazuľová polievka s pivným praclíkom",
        soupAllergens: "1,3,9",
        main1: "Bravčová panenka s demiglace omáčkou a knedľou",
        main1Allergens: "1,3,7",
        main2: "Cézar šalát s grilovaným kuracím mäsom",
        main2Allergens: "1,3,7,12",
        special: "Flammkuchen paradajky, rukola",
        specialAllergens: "1,3,7",
      },
      {
        dayOfWeek: 5,
        soup: "Cesnakový krém so syrovým krutónom",
        soupAllergens: "1,3,7,9",
        main1: "Ryba dňa s varenými zemiakmi a tatárskou omáčkou",
        main1Allergens: "1,3,4,7,10",
        main2: "Kurací steak s pečenými baby zemiakmi",
        main2Allergens: "7",
        special: "Grilovaný flank steak s chimichurri",
        specialAllergens: "7",
      },
    ],
  });
  console.log("Created daily menus");

  // ─── Events ─────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        title: "Vedomostno-zábavný FestDobrýKvíz s Calim v Spilke/Hlohovec",
        date: "2026-04-27",
        time: "19:00",
        organizer: "FestDobrý kvíz s Calim",
        type: "quiz",
      },
      {
        title: "Vedomostno-zábavný FestDobrýKvíz s Calim v Spilke/Hlohovec",
        date: "2026-03-16",
        time: "19:00",
        organizer: "FestDobrý kvíz s Calim",
        type: "quiz",
      },
      {
        title: "Valentín pri dobrom jedle & živej hudbe",
        date: "2026-02-14",
        organizer: "Spilka Terasa Hlohovec",
        type: "valentine",
      },
      {
        title: "Vedomostno-zábavný FestDobrýKvíz s Calim v Spilke/Hlohovec",
        date: "2026-01-19",
        time: "19:00",
        organizer: "FestDobrý kvíz s Calim",
        type: "quiz",
      },
      {
        title: "Vedomostno-zábavný FestDobrýKvíz s Calim v Spilke/Hlohovec",
        date: "2026-01-05",
        time: "19:00",
        organizer: "FestDobrý kvíz s Calim",
        type: "quiz",
      },
      {
        title: "Vedomostno-zábavný FestDobrýKvíz s Calim v Spilke/Hlohovec",
        date: "2025-11-24",
        time: "19:00",
        organizer: "FestDobrý kvíz s Calim",
        type: "quiz",
      },
      {
        title: "ŽIVÁ HUDBA | Knotek & Mišley - UNPLUGGED",
        date: "2025-11-21",
        organizer: "Spilka Terasa Hlohovec",
        type: "music",
      },
      {
        title: "Vedomostno-zábavný FestDobrýKvíz s Calim v Spilke/Hlohovec",
        date: "2025-11-10",
        time: "19:00",
        organizer: "FestDobrý kvíz s Calim",
        type: "quiz",
      },
    ],
  });
  console.log("Created events");

  // ─── Gallery Images ─────────────────────────────────────────
  await prisma.galleryImage.createMany({
    data: [
      { src: "/images/spilka-interior.jpg", alt: "Interiér reštaurácie SPILKA Terasa", label: "Interiér", order: 0 },
      { src: "/images/spilka-dish.jpg", alt: "Tradičné slovenské jedlo", label: "Tradičné jedlá", order: 1 },
      { src: "/images/spilka-food.jpg", alt: "Špeciality z kuchyne SPILKA", label: "Naše špeciality", order: 2 },
      { src: "/images/spilka-beer.jpg", alt: "Čapované pivo Svijany 450", label: "Svijany 450", order: 3 },
      { src: "/images/spilka-tanks.jpg", alt: "Pivné tanky v SPILKA Terasa", label: "Pivné tanky", order: 4 },
      { src: "/images/spilka-terrace.jpg", alt: "Terasa reštaurácie", label: "Terasa", order: 5 },
      { src: "/images/spilka-event-room.jpg", alt: "Spoločenská miestnosť", label: "Eventy", order: 6 },
      { src: "/images/spilka-hero.jpg", alt: "SPILKA Terasa v Hlohovci", label: "Reštaurácia", order: 7 },
    ],
  });
  console.log("Created gallery images");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
