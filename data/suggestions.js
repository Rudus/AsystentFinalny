export const allSuggestions = [
  // Kategoria: Pojazdy
  {
    icon: '🚗',
    title: 'Wymiana opon',
    description: 'Pamiętaj o sezonowej wymianie opon, aby zapewnić sobie bezpieczeństwo na drodze.',
    personaKey: 'hasCar',
    question: {
        text: 'Chciałem tylko potwierdzić, czy posiadasz samochód?',
        key: 'hasCar',
    }
  },
  {
    icon: '🔧',
    title: 'Przegląd techniczny',
    description: 'Sprawdź datę ważności przeglądu technicznego swojego pojazdu.',
    personaKey: 'hasCar',
    question: { text: 'Czy posiadasz samochód, aby przypominać o przeglądzie?', key: 'hasCar' }
  },
  {
    icon: '�',
    title: 'Ubezpieczenie OC/AC',
    description: 'Zbliża się koniec Twojej polisy. Warto porównać nowe oferty.',
    personaKey: 'hasCar',
    question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }
  },
  { icon: '🧼', title: 'Myjnia', description: 'Czas odświeżyć wygląd Twojego samochodu i zadbać o lakier.' },
  { icon: '💧', title: 'Sprawdzenie płynów', description: 'Upewnij się, że poziom oleju i płynu do spryskiwaczy jest odpowiedni.', personaKey: 'hasCar', question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }},
  { icon: ' wipers ', title: 'Wymiana wycieraczek', description: 'Dobre wycieraczki to podstawa widoczności. Warto je wymieniać co najmniej raz w roku.', personaKey: 'hasCar', question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }},
  { icon: '💨', title: 'Czyszczenie klimatyzacji', description: 'Odgrzybianie i serwis klimatyzacji zapewni czyste powietrze wewnątrz auta.', personaKey: 'hasCar', question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }},
  { icon: '🩹', title: 'Sprawdzenie apteczki', description: 'Upewnij się, że apteczka samochodowa jest kompletna i ma aktualne daty ważności.', personaKey: 'hasCar', question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }},
  { icon: '🔘', title: 'Ciśnienie w oponach', description: 'Prawidłowe ciśnienie w oponach to mniejsze spalanie i większe bezpieczeństwo.', personaKey: 'hasCar', question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }},
  { icon: '✨', title: 'Woskowanie lakieru', description: 'Zabezpiecz lakier przed zimą lub odśwież go na lato, aby dłużej zachował blask.', personaKey: 'hasCar', question: { text: 'Czy posiadasz samochód?', key: 'hasCar' }},

  // Kategoria: Zdrowie i Uroda
  { icon: '🦷', title: 'Wizyta u dentysty', description: 'Regularne kontrole to klucz do zdrowego uśmiechu. Pamiętaj o wizycie co 6 miesięcy.' },
  { icon: '👓', title: 'Okulista / Optyk', description: 'Twój wzrok jest ważny. Warto go regularnie kontrolować, zwłaszcza jeśli pracujesz przy komputerze.' },
  { icon: '🩸', title: 'Badania okresowe', description: 'Podstawowe badania krwi i moczu to fundament profilaktyki.' },
  { icon: '💇‍♂️', title: 'Wizyta u fryzjera', description: 'Czas odświeżyć fryzurę i poczuć się lepiej.' },
  { icon: '🏋️‍♀️', title: 'Zapis na siłownię', description: 'Aktywność fizyczna to zdrowie. Może to dobry moment, by zacząć?' },
  { icon: '👨‍⚕️', title: 'Wizyta u fizjoterapeuty', description: 'Jeśli masz siedzącą pracę, prewencyjna wizyta u fizjoterapeuty może zdziałać cuda.' },
  { icon: '💆‍♀️', title: 'Masaż relaksacyjny', description: 'Należy Ci się chwila odprężenia. Zaplanuj relaksujący masaż.' },
  { icon: '💊', title: 'Uzupełnienie witamin', description: 'Szczególnie w okresach przejściowych, pamiętaj o suplementacji witaminy D.' },
  { icon: '🧘', title: 'Dzień dla siebie', description: 'Zaplanuj jeden wieczór lub popołudnie w tygodniu tylko dla siebie. Bez obowiązków.' },
  { icon: '🔍', title: 'Badanie znamion', description: 'Pamiętaj o regularnej kontroli znamion u dermatologa, zwłaszcza po lecie.' },

  // Kategoria: Dom i Mieszkanie
  { icon: '💸', title: 'Opłacenie rachunków', description: 'Upewnij się, że wszystkie rachunki za media są opłacone na czas.' },
  { icon: '🧹', title: 'Generalne porządki', description: 'Czas na większe porządki i pozbycie się niepotrzebnych rzeczy.' },
  { icon: '🔥', title: 'Przegląd kominiarski', description: 'Jeśli mieszkasz w domu, pamiętaj o regularnym przeglądzie komina.', personaKey: 'livesInHouse', question: { text: 'Czy mieszkasz w domu jednorodzinnym?', key: 'livesInHouse' } },
  { icon: '❄️', title: 'Serwis klimatyzacji', description: 'Czas wyczyścić i sprawdzić klimatyzację przed sezonem letnim.' },
  { icon: '📦', title: 'Uporządkowanie piwnicy', description: 'To dobre zadanie na weekend. Może znajdziesz tam zapomniane skarby?' },
  { icon: '🪟', title: 'Mycie okien', description: 'Czyste okna wpuszczają więcej światła i poprawiają nastrój.' },
  { icon: '👕', title: 'Porządek w szafie', description: 'Przejrzyj ubrania i oddaj te, których już nie nosisz. Zrób miejsce na nowe.' },
  { icon: '🔧', title: 'Czyszczenie filtrów', description: 'Sprawdź filtry w okapie, zmywarce czy odkurzaczu. To kluczowe dla ich działania.' },
  { icon: '🧯', title: 'Sprawdzenie gaśnicy', description: 'Upewnij się, że domowa gaśnica ma ważną legalizację.' },
  { icon: '💧', title: 'Odkamienianie czajnika', description: 'Regularne odkamienianie czajnika i ekspresu do kawy przedłuża ich żywotność.' },

  // Kategoria: Finanse i Dokumenty
  { icon: '🧾', title: 'Rozliczenie podatków', description: 'Zbliża się ostateczny termin złożenia deklaracji podatkowej.' },
  { icon: '🆔', title: 'Sprawdzenie ważności dokumentów', description: 'Sprawdź datę ważności swojego dowodu osobistego i paszportu.' },
  { icon: '💳', title: 'Przegląd subskrypcji', description: 'Zobacz, za jakie usługi cyfrowe płacisz i czy na pewno wciąż z nich korzystasz.' },
  { icon: '📊', title: 'Analiza budżetu', description: 'Warto raz na jakiś czas przyjrzeć się swoim wydatkom i oszczędnościom.' },
  { icon: '💰', title: 'Ustawienie celów oszczędnościowych', description: 'Pomyśl, na co chciałbyś zaoszczędzić i ustal realny, miesięczny plan.' },
  { icon: '📈', title: 'Sprawdzenie wyciągów', description: 'Przejrzyj historię operacji na koncie i karcie, aby wyłapać ewentualne nieprawidłowości.' },
  { icon: '📄', title: 'Aktualizacja CV', description: 'Nawet jeśli nie szukasz pracy, warto co jakiś czas odświeżyć swoje CV o nowe umiejętności.' },
  { icon: '💾', title: 'Kopia zapasowa danych', description: 'Zrób backup ważnych plików z komputera i telefonu. Lepiej zapobiegać niż leczyć.' },
  { icon: '🚦', title: 'Sprawdzenie punktów karnych', description: 'Warto od czasu do czasu sprawdzić stan swoich punktów karnych online.' },
  { icon: '🏦', title: 'Analiza oferty banku', description: 'Sprawdź, czy Twój bank nie ma dla Ciebie nowej, lepszej oferty konta lub lokaty.' },

  // Kategoria: Relacje i Okazje
  { icon: '🎂', title: 'Pamiętaj o urodzinach', description: 'Zbliżają się urodziny bliskiej osoby. Może warto już pomyśleć o prezencie?' },
  { icon: '❤️', title: 'Zaplanuj randkę', description: 'Zadbaj o relację i zaplanuj wyjątkowy wieczór tylko we dwoje.' },
  { icon: '👨‍👩‍👧', title: 'Odwiedź rodziców/dziadków', description: 'Znajdź chwilę, aby odwiedzić bliskich i spędzić z nimi czas.' },
  { icon: '✈️', title: 'Planowanie wakacji', description: 'To dobry moment, aby zacząć myśleć o letnim (lub zimowym) urlopie.' },
  { icon: '📞', title: 'Zadzwoń do przyjaciela', description: 'Odezwij się do starego przyjaciela, z którym dawno nie rozmawiałeś.' },
  { icon: '🎉', title: 'Zorganizuj spotkanie', description: 'Zaproś znajomych na planszówki, grilla lub wspólne wyjście.' },
  { icon: '💖', title: 'Pamiętaj o rocznicy', description: 'Zbliża się ważna rocznica. Warto zaplanować coś specjalnego.' },
  { icon: '✉️', title: 'Wyślij kartkę', description: 'Zamiast SMS-a, wyślij bliskim tradycyjną kartkę z pozdrowieniami. To miły gest.' },
  { icon: '💐', title: 'Kup kwiaty bez okazji', description: 'Spraw przyjemność bliskiej osobie i podaruj jej kwiaty bez żadnego powodu.' },
  { icon: '🏕️', title: 'Zaplanuj weekendowy wyjazd', description: 'Nawet krótki, dwudniowy wyjazd potrafi naładować baterie.' },
];