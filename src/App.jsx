
import { useState, useEffect, useCallback, useRef } from "react";

const EVENTS = [
  { id:1,theater:"UKRAINA",tier:2,headline:"Rosja przeprowadza ćwiczenia nuklearne na granicy",source:"Reuters / potwierdzone 3 źródła",choices:[{label:"Wzmocnij tarczę NATO",effects:{tension:+6,economy:-4,stability:-2,nuclear:+3}},{label:"Zażądaj wyjaśnień dyplomatycznych",effects:{tension:+2,economy:0,stability:+1,nuclear:-1}},{label:"Zignoruj — prowokacja medialna",effects:{tension:+9,economy:+1,stability:-5,nuclear:+5}}],aiRecommendation:1,aiReason:"Kanały dyplomatyczne zmniejszają eskalację przy minimalnych kosztach."},
  { id:2,theater:"IRAN",tier:3,headline:"Polymarket: 38% szans na atak Iranu na bazę USA w ciągu 30 dni",source:"Polymarket / Intel CIA",choices:[{label:"Ewakuuj personel z baz",effects:{tension:+4,economy:-2,stability:+3,nuclear:-2}},{label:"Wyślij dodatkowe lotniskowce",effects:{tension:+10,economy:-6,stability:-4,nuclear:+4}},{label:"Negocjuj przez Katar",effects:{tension:-3,economy:-1,stability:+5,nuclear:-3}}],aiRecommendation:2,aiReason:"Dyplomacja przez neutralny kanał obniża ryzyko przy zachowaniu presji."},
  { id:3,theater:"GOSPODARKA",tier:1,headline:"Ropa przekroczyła $115/baryłkę po zamknięciu Cieśniny Ormuz",source:"Bloomberg Terminal",choices:[{label:"Uwolnij rezerwy strategiczne",effects:{tension:-2,economy:+5,stability:+2,nuclear:0}},{label:"Nałóż sankcje na eksporterów",effects:{tension:+5,economy:-3,stability:-3,nuclear:+1}},{label:"Szukaj alternatywnych tras",effects:{tension:0,economy:+2,stability:+1,nuclear:0}}],aiRecommendation:0,aiReason:"Rezerwy strategiczne stabilizują rynek bez eskalacji geopolitycznej."},
  { id:4,theater:"ROSJA",tier:3,headline:"Putin grozi użyciem taktycznej broni nuklearnej na Krymie",source:"Kreml / tłumaczenie NSA",choices:[{label:"Twarda odpowiedź NATO Article 5",effects:{tension:+12,economy:-5,stability:-8,nuclear:+10}},{label:"Linia gorąca — rozmowa bezpośrednia",effects:{tension:-4,economy:0,stability:+3,nuclear:-5}},{label:"Tajna groźba kontrnatarcia",effects:{tension:+3,economy:-2,stability:0,nuclear:+2}}],aiRecommendation:1,aiReason:"Bezpośrednia komunikacja zmniejsza ryzyko kalkulacyjnego błędu."},
  { id:5,theater:"USA",tier:1,headline:"Kongres blokuje pomoc militarną dla Ukrainy — głosowanie 218:217",source:"AP / C-SPAN",choices:[{label:"Obejdź — fundusz wykonawczy",effects:{tension:+4,economy:-3,stability:-5,nuclear:+1}},{label:"Znajdź koalicję europejską",effects:{tension:+2,economy:-1,stability:+2,nuclear:0}},{label:"Zaakceptuj wynik głosowania",effects:{tension:+8,economy:+2,stability:-6,nuclear:+3}}],aiRecommendation:1,aiReason:"Koalicja europejska zachowuje wsparcie bez kryzysu konstytucyjnego."},
  { id:6,theater:"IZRAEL",tier:2,headline:"Izrael przeprowadza uderzenie na obiekt nuklearny w Natanz",source:"IDF statement / potwierdzone satelitarnie",choices:[{label:"Potęp publicznie Izrael",effects:{tension:-5,economy:0,stability:+3,nuclear:-4}},{label:"Dyskretne wsparcie dyplomatyczne",effects:{tension:+3,economy:0,stability:-2,nuclear:-6}},{label:"Weto w Radzie Bezpieczeństwa",effects:{tension:+6,economy:-1,stability:-4,nuclear:-2}}],aiRecommendation:1,aiReason:"Dyskretna dyplomacja chroni sojusze bez publicznej eskalacji."},
  { id:7,theater:"CHINY",tier:2,headline:"PLA rozmieszcza 80 000 żołnierzy przy cieśninie Tajwańskiej",source:"STRATFOR / Pentagon briefing",choices:[{label:"Wyślij Siódmą Flotę",effects:{tension:+11,economy:-4,stability:-6,nuclear:+5}},{label:"Wzmocnij sankcje handlowe",effects:{tension:+5,economy:-7,stability:-1,nuclear:+1}},{label:"Dialog przez ambasadorów",effects:{tension:-3,economy:-1,stability:+2,nuclear:-1}}],aiRecommendation:2,aiReason:"Kanały dyplomatyczne dają czas bez bezpośredniej konfrontacji militarnej."},
  { id:8,theater:"UKRAINA",tier:2,headline:"Ukraina prosi o systemy ATACMS o zasięgu 300km",source:"Zelensky / Biały Dom",choices:[{label:"Wyślij ATACMS",effects:{tension:+8,economy:-3,stability:+2,nuclear:+4}},{label:"Wyślij krótszy zasięg — kompromis",effects:{tension:+3,economy:-2,stability:+1,nuclear:+1}},{label:"Odmów — ryzyko eskalacji",effects:{tension:+5,economy:0,stability:-4,nuclear:0}}],aiRecommendation:1,aiReason:"Kompromis w zasięgu minimalizuje prowokację przy zachowaniu wsparcia."},
  { id:9,theater:"GOSPODARKA",tier:1,headline:"S&P 500 spada 8% — rynki wyceniają wojnę w Zatoce Perskiej",source:"NYSE / Fed Reserve Emergency",choices:[{label:"Fed interweniuje — obniżka stóp",effects:{tension:0,economy:+7,stability:+3,nuclear:0}},{label:"G7 wydaje wspólne oświadczenie",effects:{tension:-2,economy:+4,stability:+5,nuclear:-1}},{label:"Brak reakcji — daj rynkowi działać",effects:{tension:+2,economy:-5,stability:-4,nuclear:0}}],aiRecommendation:1,aiReason:"Koordynacja G7 przywraca pewność bez ryzyka inflacyjnego."},
  { id:10,theater:"ROSJA",tier:3,headline:"Oreshnik trafia w Lwów — pierwsza rakieta hipersoniczna na miasto NATO",source:"MOD Polska / NATO SACEUR",choices:[{label:"Artykuł 5 — pełna odpowiedź",effects:{tension:+20,economy:-8,stability:-12,nuclear:+15}},{label:"Tajne uderzenie odwetowe",effects:{tension:+12,economy:-4,stability:-6,nuclear:+8}},{label:"Nadzwyczajne posiedzenie Rady NATO",effects:{tension:+5,economy:-2,stability:-2,nuclear:+2}}],aiRecommendation:2,aiReason:"Konsultacje przed działaniem minimalizują ryzyko niekontrolowanej eskalacji."},
  { id:11,theater:"IRAN",tier:2,headline:"Iran ogłasza 90% wzbogacenie uranu — próg militarny przekroczony",source:"MAEA Wiedeń / New York Times",choices:[{label:"Ultimatum 48h — cofnij lub sankcje",effects:{tension:+8,economy:-2,stability:-3,nuclear:+8}},{label:"Nadzwyczajna sesja MAEA",effects:{tension:+3,economy:0,stability:+1,nuclear:+2}},{label:"Tajna operacja sabotażu",effects:{tension:+5,economy:0,stability:-2,nuclear:-5}}],aiRecommendation:1,aiReason:"Multilateralne podejście buduje koalicję zamiast izolować."},
  { id:12,theater:"USA",tier:1,headline:"Maven Smart System proponuje 340 celów w Iranie — AI rekomenduje natychmiastowy atak",source:"Pentagon / CENTCOM",choices:[{label:"Zatwierdź cele AI natychmiast",effects:{tension:+14,economy:-3,stability:-8,nuclear:+7}},{label:"Weryfikuj ręcznie 72h",effects:{tension:+3,economy:-1,stability:+1,nuclear:+1}},{label:"Odrzuć — zbyt wysokie ryzyko cywilne",effects:{tension:-2,economy:0,stability:+4,nuclear:-2}}],aiRecommendation:1,aiReason:"Ludzka weryfikacja celów AI jest kluczowa przy tak wysokim ryzyku."},
  { id:13,theater:"CHINY",tier:1,headline:"Chiny nakładają embargo na eksport półprzewodników do USA",source:"MOFCOM Beijing / Bloomberg",choices:[{label:"Embargo wzajemne na chińskie towary",effects:{tension:+7,economy:-9,stability:-3,nuclear:+2}},{label:"Przyspiesz krajową produkcję chipów",effects:{tension:0,economy:-4,stability:+2,nuclear:0}},{label:"Negocjuj przez WTO",effects:{tension:-2,economy:-2,stability:+3,nuclear:0}}],aiRecommendation:1,aiReason:"Uniezależnienie technologiczne to długoterminowe rozwiązanie."},
  { id:14,theater:"ROSJA",tier:2,headline:"Rosyjski okręt podwodny z ICBM obserwowany 200km od Nowego Jorku",source:"NORAD / US Navy SOSUS",choices:[{label:"Poślij okręt eskortujący z komunikatem",effects:{tension:+5,economy:0,stability:-2,nuclear:+4}},{label:"Milcząca obserwacja",effects:{tension:+1,economy:0,stability:0,nuclear:+2}},{label:"Publiczne ostrzeżenie przez media",effects:{tension:+10,economy:-2,stability:-5,nuclear:+6}}],aiRecommendation:1,aiReason:"Dyskretna obserwacja nie prowokuje przy pełnej świadomości sytuacyjnej."},
  { id:15,theater:"UKRAINA",tier:1,headline:"Ceasefire talks w Stambule — Rosja oferuje 24h przerwę w ogniu",source:"Erdogan / Kremlin statement",choices:[{label:"Zaakceptuj — sprawdź dobrą wolę",effects:{tension:-8,economy:+2,stability:+6,nuclear:-4}},{label:"Odrzuć — pułapka taktyczna",effects:{tension:+4,economy:0,stability:-3,nuclear:+2}},{label:"Żądaj 72h jako minimum",effects:{tension:-3,economy:+1,stability:+2,nuclear:-2}}],aiRecommendation:0,aiReason:"Krótka przerwa weryfikuje intencje przy minimalnym ryzyku."},
  { id:16,theater:"IRAN",tier:2,headline:"Hezbollah wystrzeliwuje 3000 rakiet na Tel Awiw — Izrael aktywuje Iron Dome Plus",source:"IDF / Al Jazeera",choices:[{label:"USA dostarcza amunicję interceptorów",effects:{tension:+6,economy:-3,stability:-4,nuclear:+2}},{label:"Nacisk na natychmiastowe zawieszenie",effects:{tension:-4,economy:-1,stability:+3,nuclear:-1}},{label:"Izolacja — własna sprawa Izraela",effects:{tension:+8,economy:0,stability:-6,nuclear:+3}}],aiRecommendation:1,aiReason:"Presja na zawieszenie ognia chroni cywilów i zmniejsza długoterminowe ryzyko."},
  { id:17,theater:"GOSPODARKA",tier:2,headline:"SWIFT odcina 12 banków rosyjskich — kontratak cybernetyczny na infrastrukturę UE",source:"ECB Frankfurt / CISA Alert",choices:[{label:"Kontreatak ofensywny cybernetyczny",effects:{tension:+9,economy:-4,stability:-3,nuclear:+3}},{label:"Wzmocnij obronę infrastruktury",effects:{tension:+2,economy:-3,stability:+2,nuclear:0}},{label:"Negocjuj zasady cyberwojny",effects:{tension:-3,economy:-1,stability:+4,nuclear:-1}}],aiRecommendation:1,aiReason:"Obrona infrastruktury krytycznej jest priorytetem nad ofensywą cybernetyczną."},
  { id:18,theater:"OGÓLNE",tier:1,headline:"WHO: globalny kryzys uchodźczy — 45M ludzi przemieszczonych",source:"UNHCR / WHO Geneva",choices:[{label:"Otwórz granice — pełna pomoc humanitarna",effects:{tension:-5,economy:-4,stability:+4,nuclear:-2}},{label:"Finansuj obozy przy granicach",effects:{tension:-2,economy:-2,stability:+1,nuclear:-1}},{label:"Kontrola migracji — priorytet bezpieczeństwo",effects:{tension:+4,economy:+1,stability:-6,nuclear:+1}}],aiRecommendation:1,aiReason:"Zarządzane wsparcie humanitarne stabilizuje regiony bez destabilizacji wewnętrznej."},
  { id:19,theater:"ROSJA",tier:3,headline:"BREAKING: niezidentyfikowana eksplozja nuklearna 40kt w Morzu Czarnym",source:"CTBTO seismograph / US AFTAC",choices:[{label:"Natychmiastowe DEFCON 2",effects:{tension:+20,economy:-10,stability:-15,nuclear:+20}},{label:"Czekaj — zidentyfikuj źródło",effects:{tension:+8,economy:-3,stability:-5,nuclear:+10}},{label:"Prywatna konfrontacja przez hotline",effects:{tension:+5,economy:-2,stability:-3,nuclear:+6}}],aiRecommendation:2,aiReason:"Identyfikacja źródła przed eskalacją może zapobiec błędnej odpowiedzi."},
  { id:20,theater:"CHINY",tier:2,headline:"Xi ogłasza 'ostateczne zjednoczenie Tajwanu' — termin: 18 miesięcy",source:"CCTV / White House NSC",choices:[{label:"Formalne uznanie Tajwanu",effects:{tension:+15,economy:-8,stability:-6,nuclear:+6}},{label:"Sprzedaj zaawansowane uzbrojenie Tajwanowi",effects:{tension:+9,economy:+3,stability:-3,nuclear:+3}},{label:"Dyplomatyczne red lines + dialog",effects:{tension:+3,economy:-2,stability:+1,nuclear:+1}}],aiRecommendation:2,aiReason:"Jasne linie czerwone z otwartym dialogiem dają czas bez eskalacji."},
  { id:21,theater:"UKRAINA",tier:1,headline:"Polskie F-35 eskortują ukraińskie drony nad Donbasem",source:"MOD Warszawa",choices:[{label:"Zatwierdź operację",effects:{tension:+5,economy:-2,stability:+2,nuclear:+2}},{label:"Nakaż odwrót polskim pilotom",effects:{tension:-3,economy:0,stability:-4,nuclear:-1}},{label:"Rozszerz mandat do 'eskorty obronnej'",effects:{tension:+8,economy:-3,stability:+1,nuclear:+3}}],aiRecommendation:0,aiReason:"Eskorta jest defensywna i sygnalizuje determinację bez bezpośredniego ataku."},
  { id:22,theater:"IRAN",tier:1,headline:"Iran uwalnia 5 zakładników — gest dobrej woli",source:"State Dept",choices:[{label:"Odpowiedz — zwolnij irańskich więźniów",effects:{tension:-6,economy:0,stability:+5,nuclear:-3}},{label:"Przyjmij bez rewanżu",effects:{tension:-2,economy:0,stability:+2,nuclear:-1}},{label:"Odrzuć — to taktyka",effects:{tension:+4,economy:0,stability:-4,nuclear:+1}}],aiRecommendation:0,aiReason:"Wzajemność gestów buduje przestrzeń do szerszych negocjacji."},
  { id:23,theater:"GOSPODARKA",tier:1,headline:"Rosja i Chiny ogłaszają walutę BRICS++ — alternatywę dla dolara",source:"Xinhua / RT",choices:[{label:"Sankcje na wszystkie transakcje BRICS++",effects:{tension:+10,economy:-6,stability:-4,nuclear:+2}},{label:"Wzmocnij koalicję G7 wokół dolara",effects:{tension:+3,economy:-2,stability:+3,nuclear:0}},{label:"Obserwuj — brak działań",effects:{tension:+5,economy:-4,stability:-2,nuclear:0}}],aiRecommendation:1,aiReason:"Koalicja G7 to odpowiedź systemowa minimalizująca prowokację."},
  { id:24,theater:"USA",tier:2,headline:"Cyberatak na sieć energetyczną wschodniego wybrzeża USA — 12h blackout",source:"CISA / NSA",choices:[{label:"Przypisz publicznie Rosji i odpowiedz",effects:{tension:+11,economy:-5,stability:-6,nuclear:+4}},{label:"Cicha atrybucja + dyplomatyczna presja",effects:{tension:+4,economy:-3,stability:-2,nuclear:+1}},{label:"Wzmocnij sieć — brak odpowiedzi",effects:{tension:+2,economy:-4,stability:+1,nuclear:0}}],aiRecommendation:1,aiReason:"Cicha presja nie daje propagandowego pretekstu do eskalacji."},
  { id:25,theater:"ROSJA",tier:2,headline:"Wagner 2.0 wkracza do Mołdawii — PMC bez flagi",source:"ISW / Bellingcat",choices:[{label:"Wyślij siły NATO do Mołdawii",effects:{tension:+12,economy:-4,stability:-5,nuclear:+5}},{label:"Broń i finansuj opór mołdawski",effects:{tension:+6,economy:-2,stability:-2,nuclear:+2}},{label:"Pilna rezolucja ONZ",effects:{tension:+2,economy:0,stability:+2,nuclear:+1}}],aiRecommendation:1,aiReason:"Wsparcie bez bezpośredniego zaangażowania militarnego NATO minimalizuje eskalację."},
  { id:26,theater:"IZRAEL",tier:2,headline:"Izrael testuje broń EMP zdolną wyłączyć irański system C2",source:"Haaretz / wywiad",choices:[{label:"Zielone światło dla Izraela",effects:{tension:+7,economy:0,stability:-3,nuclear:-4}},{label:"Wstrzymaj — konsultacje",effects:{tension:+1,economy:0,stability:+2,nuclear:-1}},{label:"Zabroń — zbyt destabilizujące",effects:{tension:-2,economy:0,stability:+3,nuclear:-2}}],aiRecommendation:2,aiReason:"Zakaz uderza w sojusz, ale utrzymuje stabilność regionalną."},
  { id:27,theater:"OGÓLNE",tier:1,headline:"ONZ proponuje globalną strefę zakazu lotów nad strefami konfliktu",source:"UN Security Council",choices:[{label:"Popieraj i egzekwuj",effects:{tension:-4,economy:-2,stability:+6,nuclear:-3}},{label:"Wstrzymaj się — precedens",effects:{tension:0,economy:0,stability:+1,nuclear:0}},{label:"Veto — ogranicza suwerenność",effects:{tension:+5,economy:0,stability:-4,nuclear:+2}}],aiRecommendation:0,aiReason:"Strefa zakazu lotów zmniejsza ryzyko przypadkowych incydentów."},
  { id:28,theater:"CHINY",tier:1,headline:"Chiny blokują GPS w promieniu 500km od Tajwanu",source:"US Navy / Airbus",choices:[{label:"Aktywuj backup — ignoruj",effects:{tension:+2,economy:-1,stability:0,nuclear:+1}},{label:"Formalne oskarżenie na forum IMO",effects:{tension:+3,economy:0,stability:+2,nuclear:0}},{label:"Zakłóć chińskie GPS wzajemnie",effects:{tension:+9,economy:-2,stability:-4,nuclear:+3}}],aiRecommendation:1,aiReason:"Wielostronne forum prawne daje czas bez militarnej odpowiedzi."},
  { id:29,theater:"UKRAINA",tier:3,headline:"Ukraina odbija Chersoń — Rosja grozi 'ostatecznymi środkami'",source:"Zaluzhnyi / Kreml",choices:[{label:"Świętuj i kontynuuj ofensywę",effects:{tension:+10,economy:+1,stability:+3,nuclear:+8}},{label:"Zatrzymaj ofensywę — daj Rosji wyjście",effects:{tension:-5,economy:0,stability:+4,nuclear:-4}},{label:"Negocjuj z pozycji siły",effects:{tension:+2,economy:0,stability:+5,nuclear:+2}}],aiRecommendation:1,aiReason:"Dawanie Rosji wyjścia bez kapitulacji zmniejsza ryzyko nuklearne."},
  { id:30,theater:"IRAN",tier:3,headline:"Iran twierdzi, że posiada 3 gotowe głowice nuklearne — demonstracja wideo",source:"PressTV / CIA: 60% wiarygodne",choices:[{label:"Nie uwierz — dezinformacja",effects:{tension:+3,economy:0,stability:-2,nuclear:+5}},{label:"Natychmiastowe uderzenie prewencyjne",effects:{tension:+18,economy:-7,stability:-10,nuclear:+15}},{label:"Pełna weryfikacja przez MAEA + 30 dni",effects:{tension:+5,economy:0,stability:-1,nuclear:+3}}],aiRecommendation:2,aiReason:"Weryfikacja przed działaniem — uderzenie bez pewności to zbrodnia wojenna."},
  { id:31,theater:"ROSJA",tier:1,headline:"Rosja ogłasza 'humanitarny korytarz' z Odesy — de facto aneksja portu",source:"Lawrow / MOD Ukrainy",choices:[{label:"Militarna blokada korytarza",effects:{tension:+9,economy:-2,stability:-4,nuclear:+4}},{label:"Sankcje na cały eksport rosyjski",effects:{tension:+5,economy:-7,stability:-2,nuclear:+1}},{label:"Przyjmij jako fait accompli + negocjuj",effects:{tension:-2,economy:+1,stability:-6,nuclear:-1}}],aiRecommendation:1,aiReason:"Sankcje ekonomiczne wywierają presję bez bezpośredniej konfrontacji."},
  { id:32,theater:"USA",tier:1,headline:"Pentagon: budżet na AI wojskowe wzrośnie do $50 mld — krytyka etyczna",source:"HASC / NYT",choices:[{label:"Zatwierdź — wyprzedź Chiny i Rosję",effects:{tension:+4,economy:-4,stability:-2,nuclear:+3}},{label:"Żądaj komisji etycznej i zasad",effects:{tension:+1,economy:-2,stability:+4,nuclear:0}},{label:"Ogranicz do AI defensywnego",effects:{tension:-2,economy:-2,stability:+5,nuclear:-2}}],aiRecommendation:1,aiReason:"Etyczne ramy AI wojskowej są kluczowe dla długoterminowej stabilności."},
  { id:33,theater:"OGÓLNE",tier:2,headline:"Satelita wojskowy USA zbliża się do rosyjskiego — incydent na orbicie",source:"USSPACECOM",choices:[{label:"Zmień orbitę satelity USA",effects:{tension:-3,economy:-1,stability:+2,nuclear:-1}},{label:"Utrzymaj kurs — przestrzeń międzynarodowa",effects:{tension:+6,economy:0,stability:-3,nuclear:+2}},{label:"Protokół komunikacyjny z Rosją",effects:{tension:-1,economy:0,stability:+3,nuclear:-1}}],aiRecommendation:0,aiReason:"Unikanie incydentu orbitalnego zapobiega nieprzewidywalnym konsekwencjom."},
  { id:34,theater:"CHINY",tier:3,headline:"Chiny instalują rakiety DF-41 na wyspach sztucznych — 20 min do LA",source:"INDOPACOM / NRO",choices:[{label:"Misja bojowa — zniszcz instalacje",effects:{tension:+20,economy:-8,stability:-12,nuclear:+12}},{label:"Rozmieść Aegis w zasięgu odpowiedzi",effects:{tension:+8,economy:-4,stability:-3,nuclear:+5}},{label:"Negocjacje rozbrojeniowe Pacyfiku",effects:{tension:+2,economy:-1,stability:+4,nuclear:+1}}],aiRecommendation:2,aiReason:"Negocjacje rozbrojeniowe to jedyne długoterminowe rozwiązanie w regionie."},
  { id:35,theater:"UKRAINA",tier:1,headline:"40 000 polskich ochotników chce walczyć na Ukrainie",source:"MOD Polska / Sejm RP",choices:[{label:"Oficjalnie zezwól na ochotników",effects:{tension:+7,economy:-2,stability:+2,nuclear:+4}},{label:"Zakaz — ryzyko eskalacji NATO",effects:{tension:+2,economy:0,stability:-3,nuclear:-1}},{label:"Cicha akceptacja bez oficjalnej zgody",effects:{tension:+4,economy:-1,stability:-1,nuclear:+2}}],aiRecommendation:1,aiReason:"Oficjalny zakaz chroni Polskę przed bezpośrednim zaangażowaniem."},
  { id:36,theater:"IRAN",tier:1,headline:"Iran zamraża program nuklearny — żąda zniesienia sankcji w 72h",source:"Tehran / State Dept",choices:[{label:"Przyjmij — podpisz tymczasową umowę",effects:{tension:-10,economy:+4,stability:+7,nuclear:-8}},{label:"Wymagaj weryfikacji MAEA najpierw",effects:{tension:-4,economy:+1,stability:+3,nuclear:-3}},{label:"Odrzuć — ultimatum nie działają",effects:{tension:+6,economy:-2,stability:-4,nuclear:+5}}],aiRecommendation:1,aiReason:"Weryfikacja przed nagrodą to standard dyplomacji nuklearnej."},
  { id:37,theater:"GOSPODARKA",tier:2,headline:"Goldman Sachs: recesja 2027 przy kontynuacji konfliktów — 78% prawdopodobieństwo",source:"GS Research / IMF",choices:[{label:"Stymulacja fiskalna — bilion dolarów",effects:{tension:-2,economy:+6,stability:+3,nuclear:-1}},{label:"Priorytet pokojowy dla stabilizacji",effects:{tension:-5,economy:+3,stability:+5,nuclear:-3}},{label:"Zwiększ wydatki wojskowe — recesja przejdzie",effects:{tension:+4,economy:-3,stability:-4,nuclear:+2}}],aiRecommendation:1,aiReason:"Pokój to najlepsza polityka gospodarcza w tym kontekście."},
  { id:38,theater:"ROSJA",tier:2,headline:"Rosyjska propaganda: 'NATO planuje atak na Rosję w 2027'",source:"RT / Sputnik — wiarygodność: 8%",choices:[{label:"Publiczne dementi z dowodami",effects:{tension:-4,economy:0,stability:+5,nuclear:-2}},{label:"Milczenie — uwiarygodniasz reagując",effects:{tension:+2,economy:0,stability:-1,nuclear:+1}},{label:"Oficjalne oskarżenie dezinformacji w ONZ",effects:{tension:+3,economy:0,stability:+3,nuclear:+1}}],aiRecommendation:0,aiReason:"Aktywne dementi z dowodami osłabia narrację propagandową."},
  { id:39,theater:"OGÓLNE",tier:1,headline:"Papież wzywa do globalnego dnia zawieszenia broni",source:"Watykan / Associated Press",choices:[{label:"Oficjalne wsparcie — USA przystępuje",effects:{tension:-3,economy:0,stability:+4,nuclear:-2}},{label:"Ignoruj — symboliczny gest",effects:{tension:+1,economy:0,stability:-1,nuclear:+1}},{label:"Zaproponuj tydzień zawieszenia broni",effects:{tension:-5,economy:0,stability:+6,nuclear:-3}}],aiRecommendation:2,aiReason:"Dłuższe zawieszenie broni tworzy przestrzeń dla realnych negocjacji."},
  { id:40,theater:"CHINY",tier:2,headline:"Tajwan ogłasza posiadanie broni nuklearnej — 12 głowic",source:"Taipei Times / CIA: 35% wiarygodne",choices:[{label:"Potęp — naruszenie NPT",effects:{tension:+6,economy:-2,stability:-3,nuclear:+6}},{label:"Dyskretna akceptacja",effects:{tension:+3,economy:0,stability:-2,nuclear:+4}},{label:"Zażądaj natychmiastowej weryfikacji",effects:{tension:+4,economy:0,stability:-1,nuclear:+3}}],aiRecommendation:0,aiReason:"Twardy sprzeciw wobec proliferacji nuklearnej jest fundamentem NPT."},
  { id:41,theater:"UKRAINA",tier:1,headline:"Noc dronów: 1200 Shahedów atakuje Warszawę — pierwsze ofiary w Polsce",source:"MON Polska / NATO NORTHAG",choices:[{label:"Artykuł 5 — natychmiastowa odpowiedź",effects:{tension:+18,economy:-6,stability:-10,nuclear:+9}},{label:"Atak był 'błędem' — czekaj na potwierdzenie",effects:{tension:+8,economy:-2,stability:-5,nuclear:+4}},{label:"Odpowiedź proporcjonalna — 1:1",effects:{tension:+11,economy:-4,stability:-7,nuclear:+6}}],aiRecommendation:1,aiReason:"Weryfikacja przed Artykułem 5 zapobiega wojnie opartej na dezinformacji."},
  { id:42,theater:"USA",tier:2,headline:"Trump zawiesza pomoc dla Ukrainy — 'czas na deal'",source:"White House / Truth Social",choices:[{label:"Europejscy sojusznicy przejmują finansowanie",effects:{tension:+4,economy:-3,stability:-2,nuclear:+2}},{label:"Kongres blokuje decyzję prezydenta",effects:{tension:+7,economy:-1,stability:-5,nuclear:+1}},{label:"Zaakceptuj — negocjuj przez Biały Dom",effects:{tension:+6,economy:+1,stability:-4,nuclear:+3}}],aiRecommendation:0,aiReason:"Europejska ciągłość wsparcia zachowuje Ukrainę bez wewnętrznego kryzysu USA."},
  { id:43,theater:"IZRAEL",tier:3,headline:"Izrael grozi bronią nuklearną jeśli Iran uderzy w Tel Awiw",source:"IDF Nuclear Doctrine",choices:[{label:"Potęp — eskalacja nuklearna niedopuszczalna",effects:{tension:-3,economy:0,stability:+3,nuclear:-4}},{label:"Popieraj — Izrael ma prawo do obrony",effects:{tension:+8,economy:-1,stability:-4,nuclear:+8}},{label:"Pilna misja dyplomatyczna do Jerozolimy",effects:{tension:-5,economy:-1,stability:+5,nuclear:-6}}],aiRecommendation:2,aiReason:"Denuklearyzacja retoryki jest pilna — każda eskalacja nuklearna to kryzys globalny."},
  { id:44,theater:"ROSJA",tier:1,headline:"FSB aresztuje 4 oficerów za odmowę rozkazu nuklearnego",source:"Meduza / Novaya Gazeta",choices:[{label:"Publicznie chwal nieposłuszeństwo",effects:{tension:+3,economy:0,stability:-3,nuclear:-5}},{label:"Cicha informacja dla Kremla — doceniamy",effects:{tension:-2,economy:0,stability:+1,nuclear:-3}},{label:"Ignoruj — wewnętrzna sprawa Rosji",effects:{tension:+1,economy:0,stability:0,nuclear:+1}}],aiRecommendation:1,aiReason:"Dyskretna komunikacja może wzmocnić wewnętrzne hamulce w Rosji."},
  { id:45,theater:"OGÓLNE",tier:2,headline:"Stolica Apostolska oferuje terytorium neutralne dla rozmów pokojowych",source:"Watykan / AP",choices:[{label:"Popieraj i wyślij delegację",effects:{tension:-7,economy:0,stability:+8,nuclear:-5}},{label:"Sceptycyzm — symbolika bez substancji",effects:{tension:+1,economy:0,stability:-1,nuclear:0}},{label:"Zaproponuj Genewę zamiast Watykanu",effects:{tension:-3,economy:0,stability:+4,nuclear:-2}}],aiRecommendation:0,aiReason:"Każda platforma dla dialogu jest lepsza niż brak dialogu."},
  { id:46,theater:"CHINY",tier:2,headline:"Chiny sprzedają Rosji 500 dronów bojowych z AI targeting",source:"SIPRI / Treasury Dept",choices:[{label:"Sankcje wtórne na Chiny",effects:{tension:+9,economy:-8,stability:-3,nuclear:+3}},{label:"Protest dyplomatyczny + ograniczone sankcje",effects:{tension:+4,economy:-3,stability:-1,nuclear:+1}},{label:"Tajne negocjacje — Chiny jako broker pokoju",effects:{tension:-1,economy:-1,stability:+3,nuclear:-1}}],aiRecommendation:2,aiReason:"Chiny jako mediator to jedyna rola, która może ich powstrzymać."},
  { id:47,theater:"UKRAINA",tier:3,headline:"Ukraina odbija 50% Krymu — Rosja ogłasza mobilizację totalną",source:"Zaluzhnyi / Peskov",choices:[{label:"Kontynuuj ofensywę do całkowitego odzysku",effects:{tension:+15,economy:-3,stability:+2,nuclear:+12}},{label:"Zatrzymaj się — negocjuj z pozycji siły",effects:{tension:-6,economy:+1,stability:+5,nuclear:-5}},{label:"Wymień 50% Krymu na trwały pokój",effects:{tension:-10,economy:+2,stability:+8,nuclear:-8}}],aiRecommendation:2,aiReason:"Terytoria można odzyskać dyplomacją — nuklearna wymiana nie ma zwycięzcy."},
  { id:48,theater:"IRAN",tier:3,headline:"Iran testuje rakietę ICBM zdolną dosięgnąć Nowego Jorku",source:"STRATCOM / DIA",choices:[{label:"Natychmiastowe sankcje maksymalne",effects:{tension:+8,economy:-4,stability:-3,nuclear:+7}},{label:"Prywatne ultimatum: test = casus belli",effects:{tension:+5,economy:-1,stability:-2,nuclear:+5}},{label:"Oferuj pakiet deeskalacyjny",effects:{tension:-3,economy:-2,stability:+3,nuclear:-3}}],aiRecommendation:2,aiReason:"Deeskalacja z pakietem zachęt może cofnąć Iran od progu ICBM."},
  { id:49,theater:"OGÓLNE",tier:3,headline:"Doomsday Clock: 30 sekund do północy — rekordowe minimum",source:"Bulletin of Atomic Scientists",choices:[{label:"Globalne przemówienie — wezwanie do pokoju",effects:{tension:-8,economy:+2,stability:+7,nuclear:-5}},{label:"Nadzwyczajny szczyt G20 w 48h",effects:{tension:-5,economy:0,stability:+5,nuclear:-4}},{label:"To tylko PR — kontynuuj kurs",effects:{tension:+4,economy:0,stability:-3,nuclear:+4}}],aiRecommendation:1,aiReason:"Multilateralny szczyt to jedyne forum zdolne cofnąć globalny zegar."},
  { id:50,theater:"OGÓLNE",tier:3,headline:"FINAL: Maven AI identyfikuje 'okno deeskalacji' — 6 godzin",source:"Maven Smart System / CENTCOM",choices:[{label:"Użyj okna — natychmiastowy pokój",effects:{tension:-20,economy:+5,stability:+15,nuclear:-20}},{label:"Weryfikuj AI — nie ufaj automatowi",effects:{tension:-5,economy:0,stability:+3,nuclear:-5}},{label:"Ignoruj AI — polityczna decyzja",effects:{tension:+5,economy:-2,stability:-3,nuclear:+5}}],aiRecommendation:0,aiReason:"Okno deeskalacji to rzadka szansa — AI lub nie, trzeba ją wykorzystać."},
];

const THEATER_COLORS = {
  UKRAINA:"#4a9eff",IRAN:"#ff6b35",ROSJA:"#cc2936",CHINY:"#ff4444",
  USA:"#5cb8ff",IZRAEL:"#f5c518",IZRAEL:"#f5c518",GOSPODARKA:"#4ade80",OGÓLNE:"#a78bfa",
};

const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

const GLOBAL_DATA = {
  total:12847,byChoice:[4823,5312,2712],
  outcome:"Świat utrzymał kurs kolizyjny. 67% graczy wybrało opcję dyplomatyczną, ale zbyt późno.",
  day:54,
};

export default function WorldSignal() {
  const [screen,setScreen] = useState("intro");
  const [day,setDay] = useState(1);
  const [metrics,setMetrics] = useState({tension:15,economy:72,stability:68,nuclear:8});
  const [eventIdx,setEventIdx] = useState(0);
  const [history,setHistory] = useState([]);
  const [animating,setAnimating] = useState(false);
  const [pendingEffects,setPendingEffects] = useState(null);
  const [showAI,setShowAI] = useState(false);
  const [chosenLabel,setChosenLabel] = useState(null);
  const [shake,setShake] = useState(false);
  const shuffledEvents = useRef([...EVENTS].sort(()=>Math.random()-0.5));
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const currentEvent = shuffledEvents.current[eventIdx % shuffledEvents.current.length];
  const isGameOver = metrics.nuclear>=100||metrics.tension>=100||metrics.stability<=0;

  const polymarketData = [
    {label:"Iran uderzy w USA",prob:38},{label:"Rosja użyje bomb nuk.",prob:12},
    {label:"Ceasefire Ukraina",prob:41},{label:"Ekspansja NATO",prob:67},
  ];

  const makeChoice = useCallback((choiceIdx) => {
    if(animating) return;
    const choice = currentEvent.choices[choiceIdx];
    setChosenLabel(choice.label);
    setAnimating(true);
    setPendingEffects(choice.effects);
    const wasAI = choiceIdx===currentEvent.aiRecommendation;
    setTimeout(()=>{
      setMetrics(prev=>({
        tension:clamp(prev.tension+(choice.effects.tension||0),0,100),
        economy:clamp(prev.economy+(choice.effects.economy||0),0,100),
        stability:clamp(prev.stability+(choice.effects.stability||0),0,100),
        nuclear:clamp(prev.nuclear+(choice.effects.nuclear||0),0,100),
      }));
      if((choice.effects.nuclear||0)>5||(choice.effects.tension||0)>8){
        setShake(true);setTimeout(()=>setShake(false),600);
      }
      setHistory(prev=>[...prev,{day,event:currentEvent.headline.substring(0,40)+"…",choice:choice.label,wasAI,theater:currentEvent.theater}]);
      setDay(d=>d+1);setEventIdx(i=>i+1);setAnimating(false);
      setShowAI(false);setChosenLabel(null);setPendingEffects(null);
    },600);
  },[animating,currentEvent,day]);

  const startGame = () => {
    setScreen("game");setDay(1);
    setMetrics({tension:15,economy:72,stability:68,nuclear:8});
    setEventIdx(0);setHistory([]);
    shuffledEvents.current=[...EVENTS].sort(()=>Math.random()-0.5);
  };

  useEffect(()=>{
    if(screen==="game"&&isGameOver) setTimeout(()=>setScreen("result"),800);
  },[metrics,screen,isGameOver]);

  // Uruchom/resetuj zegar dla tier-3
  useEffect(()=>{
    clearTimeout(timerRef.current);
    if(screen!=="game"||isGameOver){setTimeLeft(null);return;}
    if(currentEvent.tier===3){setTimeLeft(60);}
    else{setTimeLeft(null);}
  },[eventIdx,screen,isGameOver]);

  // Odliczaj co sekundę (pauza podczas animacji)
  useEffect(()=>{
    if(timeLeft===null||timeLeft<=0||animating) return;
    timerRef.current=setTimeout(()=>setTimeLeft(t=>t-1),1000);
    return()=>clearTimeout(timerRef.current);
  },[timeLeft,animating]);

  // Gdy czas minie — automatycznie wybierz najgorszą opcję
  useEffect(()=>{
    if(timeLeft!==0||screen!=="game"||animating) return;
    const worstIdx=currentEvent.choices.reduce((best,c,i)=>{
      const score=(c.effects.tension||0)+(c.effects.nuclear||0)-(c.effects.economy||0)-(c.effects.stability||0);
      const bestScore=(currentEvent.choices[best].effects.tension||0)+(currentEvent.choices[best].effects.nuclear||0)-(currentEvent.choices[best].effects.economy||0)-(currentEvent.choices[best].effects.stability||0);
      return score>bestScore?i:best;
    },0);
    makeChoice(worstIdx);
  },[timeLeft]);

  const nuclearRisk=metrics.nuclear;
  const doomColor=nuclearRisk>60?"#ff2244":nuclearRisk>30?"#ff8c00":"#4ade80";

  if(screen==="intro") return <IntroScreen onStart={startGame} onGlobal={()=>setScreen("global")}/>;
  if(screen==="result") return <ResultScreen metrics={metrics} history={history} day={day} onRestart={startGame} onGlobal={()=>setScreen("global")}/>;
  if(screen==="global") return <GlobalScreen data={GLOBAL_DATA} onBack={()=>setScreen("intro")}/>;

  return (
    <div style={{background:"#080c10",minHeight:"100vh",color:"#c8d6e0",fontFamily:"'Courier New',monospace",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",position:"relative",overflow:"hidden",...(shake?{animation:"shake 0.3s ease-in-out"}:{})}}>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes slide-up{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(255,34,68,0.3)}50%{box-shadow:0 0 20px rgba(255,34,68,0.8)}}
        @keyframes timer-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.05)}}
        .choice-btn:hover{transform:scale(1.01)} .choice-btn:active{transform:scale(0.98)}
        .metric-bar{transition:width 0.8s cubic-bezier(0.4,0,0.2,1)}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#0d1117",borderBottom:"1px solid #1e2d3d",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",animation:"pulse 2s infinite"}}/>
          <span style={{color:"#4ade80",fontSize:11,letterSpacing:3,fontWeight:700}}>WORLD SIGNAL</span>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <span style={{color:"#4a9eff",fontSize:11}}>DZIEŃ {day}</span>
          <div style={{padding:"2px 8px",borderRadius:2,background:nuclearRisk>50?"rgba(255,34,68,0.2)":"rgba(74,222,128,0.1)",border:`1px solid ${nuclearRisk>50?"#ff2244":"#4ade80"}`,animation:nuclearRisk>50?"glow 1.5s infinite":"none"}}>
            <span style={{fontSize:10,color:doomColor}}>☢ {nuclearRisk}%</span>
          </div>
        </div>
      </div>

      {/* METRYKI */}
      <div style={{background:"#0a0f14",padding:"12px 16px",borderBottom:"1px solid #1a2535"}}>
        {[{key:"tension",label:"NAPIĘCIE MILITARNE",color:"#ff4444",icon:"⚔"},{key:"economy",label:"GOSPODARKA",color:"#4ade80",icon:"◈"},{key:"stability",label:"STABILNOŚĆ POLITYCZNA",color:"#4a9eff",icon:"⬡"},{key:"nuclear",label:"RYZYKO NUKLEARNE",color:"#ff8c00",icon:"☢"}].map(m=>(
          <div key={m.key} style={{marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:9,letterSpacing:2,color:"#5a7a8a"}}>{m.icon} {m.label}</span>
              <span style={{fontSize:10,color:m.color,fontWeight:700}}>{metrics[m.key]}%</span>
            </div>
            <div style={{background:"#1a2535",height:4,borderRadius:2,overflow:"hidden"}}>
              <div className="metric-bar" style={{height:"100%",width:`${metrics[m.key]}%`,background:`linear-gradient(90deg,${m.color}88,${m.color})`,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>

      {/* POLYMARKET TICKER */}
      <div style={{background:"#0d1117",padding:"6px 16px",borderBottom:"1px solid #1e2d3d"}}>
        <div style={{display:"flex",gap:16,fontSize:9,color:"#5a7a8a",overflowX:"auto",whiteSpace:"nowrap"}}>
          <span style={{color:"#ff8c00",letterSpacing:1,flexShrink:0}}>◈ POLYMARKET</span>
          {polymarketData.map(p=>(
            <span key={p.label} style={{flexShrink:0}}>
              <span style={{color:"#c8d6e0"}}>{p.label}</span>
              <span style={{color:p.prob>50?"#ff4444":"#4ade80",marginLeft:4}}>{p.prob}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* EVENT CARD */}
      <div style={{flex:1,padding:"16px",display:"flex",flexDirection:"column",gap:12,animation:"slide-up 0.3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:2,background:`${THEATER_COLORS[currentEvent.theater]||"#a78bfa"}15`,border:`1px solid ${THEATER_COLORS[currentEvent.theater]||"#a78bfa"}`}}>
            <span style={{fontSize:10,letterSpacing:2,color:THEATER_COLORS[currentEvent.theater]||"#a78bfa",fontWeight:700}}>{currentEvent.theater}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {timeLeft!==null&&(
              <div style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:2,background:timeLeft<=10?"rgba(255,34,68,0.15)":"rgba(255,140,0,0.1)",border:`1px solid ${timeLeft<=10?"#ff2244":"#ff8c00"}`,animation:timeLeft<=10?"timer-pulse 0.5s ease-in-out infinite":"none"}}>
                <span style={{fontSize:10,color:timeLeft<=10?"#ff2244":"#ff8c00",fontWeight:700,fontVariantNumeric:"tabular-nums"}}>⏱ {String(timeLeft).padStart(2,"0")}s</span>
              </div>
            )}
            <div style={{display:"flex",gap:4}}>
              {[1,2,3].map(i=><div key={i} style={{width:6,height:6,borderRadius:1,background:i<=currentEvent.tier?"#ff8c00":"#1e2d3d"}}/>)}
            </div>
          </div>
        </div>

        <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"14px 16px"}}>
          <div style={{fontSize:13,lineHeight:1.5,color:"#e8f0f5",fontWeight:700,marginBottom:8}}>{currentEvent.headline}</div>
          <div style={{fontSize:10,color:"#3a5a6a",display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:"#4a9eff"}}>▸</span>{currentEvent.source}
          </div>
        </div>

        <button onClick={()=>setShowAI(!showAI)} style={{background:showAI?"rgba(74,158,255,0.15)":"transparent",border:`1px solid ${showAI?"#4a9eff":"#1e2d3d"}`,color:showAI?"#4a9eff":"#3a5a6a",borderRadius:3,padding:"6px 12px",fontSize:10,letterSpacing:2,cursor:"pointer",textAlign:"left",transition:"all 0.2s",fontFamily:"inherit"}}>
          {showAI?"▼":"▶"} MAVEN AI: {showAI?currentEvent.choices[currentEvent.aiRecommendation].label.toUpperCase():"POKAŻ REKOMENDACJĘ"}
        </button>

        {showAI&&(
          <div style={{background:"rgba(74,158,255,0.06)",border:"1px solid #1e3d5a",borderRadius:3,padding:"10px 12px",fontSize:11,color:"#5a9abf",lineHeight:1.5}}>
            {currentEvent.aiReason}
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {currentEvent.choices.map((choice,i)=>{
            const isAI=i===currentEvent.aiRecommendation;
            const isPending=chosenLabel===choice.label;
            return(
              <button key={i} className="choice-btn" onClick={()=>makeChoice(i)} disabled={animating} style={{background:isPending?"rgba(74,222,128,0.1)":isAI&&showAI?"rgba(74,158,255,0.08)":"#0d1117",border:`1px solid ${isPending?"#4ade80":isAI&&showAI?"#1e3d5a":"#1e2d3d"}`,color:isPending?"#4ade80":"#c8d6e0",borderRadius:4,padding:"12px 14px",fontSize:12,textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s",lineHeight:1.4,fontFamily:"inherit"}}>
                <span>{choice.label}</span>
                <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
                  {isAI&&showAI&&<span style={{fontSize:9,color:"#4a9eff",letterSpacing:1,border:"1px solid #1e3d5a",padding:"1px 5px",borderRadius:2}}>AI</span>}
                  <span style={{fontSize:16,color:"#3a5a6a"}}>›</span>
                </div>
              </button>
            );
          })}
        </div>

        {pendingEffects&&(
          <div style={{background:"#0a0f14",border:"1px solid #1e2d3d",borderRadius:3,padding:"8px 12px",display:"flex",gap:12,justifyContent:"center",animation:"slide-up 0.2s ease"}}>
            {Object.entries(pendingEffects).filter(([,v])=>v!==0).map(([k,v])=>(
              <span key={k} style={{fontSize:11,color:v>0?"#ff4444":"#4ade80"}}>{k.toUpperCase().substring(0,3)} {v>0?"+":""}{v}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{background:"#080c10",borderTop:"1px solid #1a2535",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:9,color:"#2a4050",letterSpacing:2}}>KLASYFIKACJA: TAJNE</span>
        <span style={{fontSize:9,color:"#2a4050"}}>{EVENTS.length-(eventIdx%EVENTS.length)} POZOSTAŁYCH BRIEFINGÓW</span>
      </div>
    </div>
  );
}

function IntroScreen({onStart,onGlobal}){
  return(
    <div style={{background:"#080c10",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Courier New',monospace",padding:24,maxWidth:480,margin:"0 auto"}}>
      <style>{`@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}} @keyframes fade-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{position:"fixed",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,rgba(74,158,255,0.3),transparent)",animation:"scan 8s linear infinite",pointerEvents:"none"}}/>
      <div style={{textAlign:"center",animation:"fade-in 0.8s ease",maxWidth:380,width:"100%"}}>
        <div style={{fontSize:11,letterSpacing:4,color:"#3a5a6a",marginBottom:16}}>SYSTEM OPERACYJNY v2.1</div>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:8,color:"#c8d6e0",marginBottom:4,textShadow:"0 0 40px rgba(74,158,255,0.3)"}}>WORLD</div>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:8,color:"#4a9eff",marginBottom:24,textShadow:"0 0 40px rgba(74,158,255,0.5)"}}>SIGNAL</div>
        <div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,#1e2d3d,transparent)",marginBottom:24}}/>
        <div style={{fontSize:12,color:"#4a6a7a",lineHeight:1.8,marginBottom:32}}>
          Symulator kryzysu globalnego oparty<br/>o dane Polymarket + newsy real-time.<br/>
          <span style={{color:"#c8d6e0"}}>Twoje decyzje kształtują trajektorię świata.</span>
        </div>
        <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"12px 16px",marginBottom:24,textAlign:"left"}}>
          <div style={{fontSize:9,letterSpacing:2,color:"#3a5a6a",marginBottom:8}}>◈ STAN ŚWIATA — {new Date().toLocaleDateString('pl-PL')}</div>
          {[{label:"Iran uderzy w USA (30 dni)",val:"38%",hot:true},{label:"Ceasefire Ukraina 2026",val:"41%",hot:false},{label:"Rosja: broń nukl. 2026",val:"12%",hot:true}].map(d=>(
            <div key={d.label} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#5a7a8a",marginBottom:4}}>
              <span>{d.label}</span><span style={{color:d.hot?"#ff8c00":"#4ade80",fontWeight:700}}>{d.val}</span>
            </div>
          ))}
        </div>
        <button onClick={onStart} onMouseEnter={e=>{e.target.style.background="rgba(74,158,255,0.1)"}} onMouseLeave={e=>{e.target.style.background="transparent"}} style={{width:"100%",padding:"14px",background:"transparent",border:"1px solid #4a9eff",color:"#4a9eff",fontFamily:"inherit",fontSize:13,letterSpacing:4,cursor:"pointer",borderRadius:3,marginBottom:10,transition:"all 0.2s"}}>
          ▶ ROZPOCZNIJ BRIEFING
        </button>
        <button onClick={onGlobal} onMouseEnter={e=>{e.target.style.borderColor="#a78bfa";e.target.style.color="#a78bfa"}} onMouseLeave={e=>{e.target.style.borderColor="#1e2d3d";e.target.style.color="#4a6a7a"}} style={{width:"100%",padding:"12px",background:"transparent",border:"1px solid #1e2d3d",color:"#4a6a7a",fontFamily:"inherit",fontSize:11,letterSpacing:3,cursor:"pointer",borderRadius:3}}>
          ◉ GLOBALNA SYMULACJA
        </button>
      </div>
    </div>
  );
}

function ResultScreen({metrics,history,day,onRestart,onGlobal}){
  const nuke=metrics.nuclear>=100,tension=metrics.tension>=100,collapse=metrics.stability<=0;
  const reason=nuke?"Eskalacja nuklearna przekroczyła punkt bez powrotu.":tension?"Napięcie militarne doprowadziło do globalnego konfliktu.":"Stabilność polityczna załamała się — chaos globalny.";
  const score=Math.round((100-metrics.nuclear)*0.4+metrics.stability*0.3+metrics.economy*0.3);
  const shareText=`🌐 WORLD SIGNAL: Świat przetrwał ${day} dni. Ryzyko nukl.: ${metrics.nuclear}%. Wynik: ${score}/100.`;
  return(
    <div style={{background:"#080c10",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Courier New',monospace",padding:24,maxWidth:480,margin:"0 auto"}}>
      <style>{`@keyframes fade-in{from{opacity:0}to{opacity:1}}`}</style>
      <div style={{width:"100%",maxWidth:380,animation:"fade-in 0.8s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>{nuke||tension||collapse?"☢":"🕊"}</div>
          <div style={{fontSize:14,letterSpacing:4,color:nuke||tension||collapse?"#ff2244":"#4ade80",fontWeight:700,marginBottom:8}}>{nuke||tension||collapse?"SYMULACJA ZAKOŃCZONA":"MISJA ZAKOŃCZONA"}</div>
          <div style={{fontSize:11,color:"#5a7a8a",lineHeight:1.6}}>{reason}</div>
        </div>
        <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"16px",marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{label:"DNI PRZETRWANIA",val:day,color:"#4a9eff"},{label:"WYNIK",val:`${score}/100`,color:score>60?"#4ade80":"#ff4444"},{label:"RYZYKO NUKL.",val:`${metrics.nuclear}%`,color:"#ff8c00"},{label:"STABILNOŚĆ",val:`${metrics.stability}%`,color:"#4a9eff"}].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:"#3a5a6a",letterSpacing:2,marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"12px",marginBottom:16}}>
          <div style={{fontSize:9,letterSpacing:2,color:"#3a5a6a",marginBottom:8}}>OSTATNIE DECYZJE</div>
          {history.slice(-5).map((h,i)=>(
            <div key={i} style={{display:"flex",gap:6,fontSize:10,color:"#5a7a8a",marginBottom:4,alignItems:"center"}}>
              <span style={{color:THEATER_COLORS[h.theater]||"#a78bfa",flexShrink:0}}>{h.theater}</span>
              <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.choice}</span>
              {h.wasAI&&<span style={{color:"#4a9eff",flexShrink:0}}>AI✓</span>}
            </div>
          ))}
        </div>
        <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"10px 12px",marginBottom:16,fontSize:11,color:"#5a7a8a",lineHeight:1.5}}>{shareText}</div>
        <button onClick={onRestart} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid #4a9eff",color:"#4a9eff",fontFamily:"inherit",fontSize:12,letterSpacing:4,cursor:"pointer",borderRadius:3,marginBottom:8}}>↺ NOWA SYMULACJA</button>
        <button onClick={onGlobal} style={{width:"100%",padding:"11px",background:"transparent",border:"1px solid #1e2d3d",color:"#4a6a7a",fontFamily:"inherit",fontSize:11,letterSpacing:3,cursor:"pointer",borderRadius:3}}>◉ GLOBALNA SYMULACJA</button>
      </div>
    </div>
  );
}

function GlobalScreen({data,onBack}){
  const pct=data.byChoice.map(v=>Math.round((v/data.total)*100));
  return(
    <div style={{background:"#080c10",minHeight:"100vh",fontFamily:"'Courier New',monospace",padding:24,maxWidth:480,margin:"0 auto",color:"#c8d6e0"}}>
      <button onClick={onBack} style={{background:"transparent",border:"none",color:"#3a5a6a",cursor:"pointer",fontSize:11,letterSpacing:2,marginBottom:20,fontFamily:"inherit"}}>‹ POWRÓT</button>
      <div style={{fontSize:11,letterSpacing:4,color:"#a78bfa",marginBottom:4}}>◉ TRYB</div>
      <div style={{fontSize:22,fontWeight:900,letterSpacing:4,marginBottom:4}}>GLOBALNA</div>
      <div style={{fontSize:22,fontWeight:900,letterSpacing:4,color:"#a78bfa",marginBottom:20}}>SYMULACJA</div>
      <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"16px",marginBottom:16}}>
        <div style={{fontSize:9,letterSpacing:2,color:"#3a5a6a",marginBottom:12}}>ŁĄCZNA LICZBA DECYZJI</div>
        <div style={{fontSize:32,fontWeight:900,color:"#a78bfa"}}>{data.total.toLocaleString()}</div>
        <div style={{fontSize:10,color:"#5a7a8a",marginTop:4}}>graczy brało udział w symulacji</div>
      </div>
      <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"16px",marginBottom:16}}>
        <div style={{fontSize:9,letterSpacing:2,color:"#3a5a6a",marginBottom:12}}>ROZKŁAD DECYZJI</div>
        {["Opcja dyplomatyczna","Opcja militarna","Opcja izolacji"].map((label,i)=>(
          <div key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
              <span style={{color:"#c8d6e0"}}>{label}</span>
              <span style={{color:"#a78bfa",fontWeight:700}}>{pct[i]}%</span>
            </div>
            <div style={{background:"#1a2535",height:6,borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct[i]}%`,background:"linear-gradient(90deg,#a78bfa88,#a78bfa)",borderRadius:3,transition:"width 1s ease"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#0d1117",border:"1px solid #1e2d3d",borderRadius:4,padding:"16px",marginBottom:16}}>
        <div style={{fontSize:9,letterSpacing:2,color:"#3a5a6a",marginBottom:8}}>KOLEKTYWNY WYNIK</div>
        <div style={{fontSize:12,color:"#ff4444",lineHeight:1.7}}>{data.outcome}</div>
        <div style={{marginTop:12,padding:"8px 12px",background:"rgba(255,34,68,0.06)",border:"1px solid rgba(255,34,68,0.2)",borderRadius:3}}>
          <div style={{fontSize:10,color:"#5a7a8a"}}>Według decyzji {data.total.toLocaleString()} graczy:</div>
          <div style={{fontSize:13,color:"#ff8c00",fontWeight:700,marginTop:4}}>Świat wszedł w wojnę nuklearną w roku {2026+Math.floor(data.day/30)}</div>
        </div>
      </div>
      <div style={{background:"#0d1117",border:"1px solid #a78bfa33",borderRadius:4,padding:"14px 16px",fontSize:11,color:"#7a5aaf",lineHeight:1.7}}>
        💡 <strong style={{color:"#a78bfa"}}>WORLD SIGNAL</strong> to nie tylko gra.<br/>
        To agregat mądrości zbiorowej — symulator nastrojów świata oparty o rzeczywiste dane z rynków predykcyjnych i globalnych newsów.
      </div>
    </div>
  );
}
