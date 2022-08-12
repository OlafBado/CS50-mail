Ten porojekt zawiera wszystkie potrzebne elementy pythona, w celu dokonczenia projektu mam wykorzystac JS, HTML i CSS.
inbox.js - w tym pliku bede kodowal

# 1 - send email.

1.  Trzeba napisac kod ktory rzeczywiscie wysle maila gdy uzytkownik zlozy form do wyslania maila.
    Wykorzystam POST request do /emails przekazujac wartosc recipients, subject i body. Gdy email zostanie wyslany,
    uzytkownik ma byc przekierowany do sent mailbox.
2.  Dzieki fetch moge zrobic request, request moze byc np GET, POST, PUT. W tym przypadku uzyje request metoda POST-uzytkownik chce wyslac maila.
    Najpierw trzeba bedzie napisac co sie dzieje gdy uzytkownik kliknie submit. Gdy kliknie submit, zlozy POST request na /emails route. Ten route 
    wywoluje funkcje compose ktora zajmuje sie obrobka zawartosci i przypisuje wyslanego maila do dwoch osob: nadawcy i odbiorcy. Gdy proces zaszedl pomyslnie,
    wyslana zostaje wiadomosc o sukcesie.
3.  Jesli uzytkownik kliknie submit i poprawnie wypelni forme to zostanie wyrenderowane sent jesli nie to inbox

# 2 - mailbox

1.  Gdy uzytkownik kliknie na inbox, sent lub archive, nalezy wyswietlic odpowiednia zawartosc. Klikajac, uzytkownik wysle get request do /emails/<mailbox> aby poprosic
    o odpowiednie emaile. Emaile maja wyswietlic sie od najnowszego. Email ma wyswietlac sie we wlasnym boksie z informacja od kogo, subject i timestamp. Jesli email jest
    nieprzeczytany to powinien miec bialy background, jesli przeczytany to szary
2.  Gdy uzytkownik klika przycisk, wysylana jest informacja do funckji. W funckji napisalem fetch dla danego inputu(inbox, sent,archived). Gdy uzytkownik klika, na konsoli wyswietla 
    sie lista odpowiednich maili. Teraz dla kazdego maila nalezy stworzyc element.
3.  Maile generuja sie wlasciwie. Teraz uzytkownik ma miec mozliwosc klikniecia w dany email by zobaczyc szczegoly. Trzeba bedzie stworzyc newy div dla emaili ktory
    bedzie wyswietlal sie gdy uzytkownik kliknie w emaila oraz trzeba bedzie wyslac request PUT aby zmienic status na przeczytany oraz zmienic tlo emaila.

V2

Projekt zaczynam drugi raz bo mialem sporo bledow. Poza tym nie zapisalem readme i nie ma calosci...

# 1 - send email.

1.  Problem na starcie, chcac sie zarejestrowac wyskakuje blad: OperationalError No Such Table.
    Rozwiazanie: wpisz komende: python manage.py migrate --run-syncdb 
2.  Dodaje event listener do input, gdy zostanie klikniety 
    Gdy uzytkownik wysle mail, na admin site wyswietlaja sie 2 maile- prawdopodobnie jeden dla uzytkownika(dla sent emails) a drugi do odbiorcy
3.  Problem: Broken pipe from(w command prompt), gdy form zostaje submit strona od razu odswieza i nie czeka na odpowiedz przez co jej nie dostaje
    Rozwiazanie: dodaj do form onsubmit="return false", to zapobiegnie odswiezaniu i wiadomosc wyswietli sie.
4.  Do momentu wyslania maila i stworzenia divow dla maili poszlo gladko. Najpierw zajme sie wczesniejszym problemem z archiwizacja.
5.  Sprobuje dla archived i inbox stworzyc buttony,
6.  Jesli mailbox === archived, stworz buttona, dodaj do niego event handlera click ktory zmieni status archieved, nastepnie append child do stworzonego diva emaila .
7.  Ta strategia dziala dobrze, problem polega na tym ze jak klikam w button to jednoczesnie klikam w to co jest za nim. Ma to zwiazek z Event bubbling/capturing.
    prawdopodobnie przez to mialem wczesniej problemy
8.  Event bubbling/capturing- chodzi o kolejnosc eventow. W moim przypadku chcialem by po kliknieciu w przycisk ostatecznie odpalil sie przycisk dlatego potrzebuje 
    capturing, czyli najpierw element bardziej od strony dokumentu az do wewnatrz. Aby uzyskac takei zachowanie dodalem do event handlera diva parametr true(zaraz po funkcji),
    ktory oznacza ze capture jest w grze. Domyslnie parametr ten ma wartosc false. Widac na konsoli kolejnosc wydarzen.
9.  Problem rozawiazany, zarowno z archiwizacja jak i ostatnim elementem na liscie.
10. W tym samym czasie pojawil sie kolejny problem, gdy klikalem przycisk to i tak odpalal sie event dla diva przez co zmienil sie status read i tym samym jego background.
    Rozwiazaniem bylo usuniecie parametru true z event listenera diva i dodanie do przyciskow archiwizacji e.stopImmediatePropagation, gdzie e jest atrybutem przekazywanym funckji 
    function(e)

# 2 - reply

1.  Uzytkownik ma miec mozliwosc klikniecia w button reply po tym jak otworzy dany email. Gdy kliknie, ma zostac przeniesiony na compose form razem z wypelnionymi danymi. Teraz mam dwie opcje,
    albo dodaje automatycznie buttona do kazdego maila albo tworze buttona tak jak dla archiwum. Sprobuje wziac tego buttona i dodac do niego event listenera.
