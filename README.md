# BPM_Detector

### Proof of Concept voor Web Research: BPM Detector
Als proof of concept voor Web Research wil ik een BPM detector maken. Dit gaat een web applicatie zijn waarbij je een liedje kan uploaden of online kan selecteren via webscraping. Dan gaat er een algoritme het tempo van het liedje bepalen en dit aan de gebruiker tonen.

#### Stap 1: research en stappenplan
Eerst moet ik natuurlijk opzoeken wat een tempo detectie algoritme eigenlijk doet om een tempo te bepalen. Hiervoor heb ik meerdere bronnen geraadpleegd (zie onderaan). Ik denk dat ik een goede begrip heb van hoe zo'n algoritme werkt. In grote lijnen:
1. Het tempo van een liedje wordt (in de meeste gevallen) bepaald door de kickdrum. Dit is technisch gezien lage frequencies die ritmisch voorkomen. Deze moet het algoritme gaan isoleren en tellen.
2. Het liedje moet eerst door een "lowpass" filter gehaalt worden. Dit filtert de hoge frequencies uit het liedje zodat je enkel nog de lage over hebt, de frequencies die van nut zijn voor tempo detectie.
3. Hierna kiest het algoritme een klein stukje (of meerdere stukjes) uit het liedje dat je wilt analyseren. Dit zijn liefst stukjes uit het refrein of chorus waar het tempo het duidelijkst is. Vermijd intro's, outro's en strofes die geen duidelijke lage frequencies hebben.
4. Ookal pak je een stuk van 10 seconden, meeste liedjes hebben een sample rate van 44100Hz. Dit is teveel data om te analyseren. Dus de volgende stap is het stuk downsamplen. Dit betekend onnodige data uit het stuk verwijderen. Downsamplen helpt ook met random pieken uit het stuk te halen, dit vergemakkelijkt het detecteren van pieken in een latere stap.
5. Als je naar de waveform kijkt die we nu hebben, zie je aan beide kanten van de x-as pieken. We hebben de negatieve pieken nodig aan de positieve kant voor correcte metingen later. Hiervoor moet je het stuk "normaliseren". \
Voor: \
![Waveform1](https://i.imgur.com/RYlCOD4.png) \
Na: \
![Waveform2](https://i.imgur.com/GUHNPSK.png)
6. Na het normaliseren zet het algoritme een threshold op de waveform, dit is een volume level die we gaan gebruiken om de hoogste pieken te isoleren en te tellen.
7. Dit gaat het algorite dus doen, het telt het aantal pieken die boven de threshold uitsteken en na wat berekeningen heb je het tempo gevonden!

#### Stap 2: nodejs en webscraping
Ik heb besloten om de gebruiker een liedje naar keuze te laten invoeren, zo kan ik mijn webscraping kennis die ik eerder dit jaar bij web research heb opgedaan toepassen. Ik ga een website scrapen die mp3 files host want het algoritme dat ik ga schrijven kan overweg met mp3 urls. Ik scrape die url en nog data dat ik wil gebruiken voor extra functionaliteit in de app. \
De app gaat dus uit 2 delen bestaan, het webscraping gedeelte en het tempo detectie gedeelte. Het webscraping gedeelte ga ik uitvoeren door middel van een nodeJS server met expressJS. Dit doe ik omdat webscrapen vanuit je browser het jezelf moeilijker maakt (uit eigen ervaring). Ik ga hier Puppeteer voor gebruiken, een nieuwe node library die snel en gemakkelijk een headless Chrome browser kan besturen. \
Het tempo detectie algoritme zal ik dan uitvoeren in browser/client-side sinds dit javascript functies bevat die nodeJS niet kan uitvoeren.

#### Stap 3: mp3 decoderen en lowpass filter
De eerste stap van het algoritme. De url wordt aangeleverd door de webscraper zoals ik hiervoor al zei. Die url wordt gefetched met een ajax request en gedecode met javascript functies zoals AudioContext() en OfflineAudioContext(). Die laatste bezit o.a. de mogelijkheid om een frequency filter op het liedje te zetten.

#### Stap 4: sample selecteren
Met OfflineAudioContext() kan je het liedje ook omzetten in samples en in een array steken. Dit is gemakkelijker om mee te werken. Dat maakt het bijvoorbeeld mogelijk om een klein stuk uit het liedje te halen om te analyseren. Ik schrijf hiervoor een functie en ik ga werken met een stukje van 10 seconden. Dit is belangrijk om te weten want dit komt later terug in de berekening van het tempo.

#### Stap 5: downsampling
Op dit moment heeft de array 441000 items, veel te veel dus. We moeten gaan downsamplen! Het downsamplen van de array gaat gemakkelijk. Ik maak hiervoor een functie die de array kan verkleinen naar een samplerate naar keuze. In dit geval kies ik voor 300 bijvoorbeeld.

#### Stap 6: normaliseren
Nu moeten de array genormaliseerd worden omdat er positieve en negatieve pieken in zitten en dit is niet handig om in de volgende stappen mee te werken. Het downsamplen gaat gebeuren door van elk item in de array de absolute waarde te berekenen. Zo worden de negatieve pieken positief en kan de threshold correct toegepast worden.

#### Stap 7: threshold en pieken tellen
De volgende stap is ook vrij straight forward. Ik definieer een threshold, dit is een volumelevel waar enkel de luidste pieken (de pieken die het tempo bepalen hopelijk) bovenuit komen. Ik ga door de array gaan en elk sample testen met de threshold of deze erbovenuit komt of niet.

#### Stap 8: tempo berekenen
Als laatste moet ik nog een simpele berekening uitvoeren om het tempo van het liedje te bekomen. Na de threshold functie heb ik een getal dat het aantal beats in een clip van 10 seconden beschrijft. Dit getal moet ik vermenigvuldigen met 6 om zo het aantal beats te weten die in een minuut voorkomen. En voila, zo bekom je per definitie het "beats per minute" of het tempo van het liedje.

#### Stap 9: tweaking
Dit algoritme dat ik heb geschreven werkt, maar is verschrikkelijk inaccuraat. Ik ga nu enkele liedjes testen waarvan ik het tempo weet terwijl ik wat parameters in het algoritme aanpas om zo (ongeveer) de juiste tempos te bekomen. Parameters die ik ga aanpassen zijn bijvoorbeeld de frequentie van de lowpass filter, de startpositie van het 10 seconde clipje en het threshold level.

#### Stap 10: de webscraper
Ik heb nu een algoritme geschreven dat bij benadering het juiste tempo van de meeste liedjes weet te berekenen. Dit is weliswaar één deel van de volledige applicatie die ik wil bouwen. De volgende stap, de webscraper maken, gaan waarschijnlijk gemakkelijker zijn sinds ik al veel over webscraping heb bijgeleerd via mijn "new technology" onderwerp in de vorige periode. \
De gebruiker gaat dus een artiest en naam van een liedje kunnen ingeven, deze data wordt doorgegeven aan een site die mp3 files host. De url van de mp3 file wordt gescraped van de site en teruggestuurd naar de gebruiker waar het algoritme de rest van het werk doet.

Ik ga deze scraper maken met Puppeteer en hosten op een nodeJS server met expressJS. Ik heb Selenium in het verleden gebruikt met python voor webscraping maar ik ga nu javascript gebruiken, dus Selenium is niet meer de beste optie. Puppeteer is een nieuwe node library ontwikkeld door Google voor o.a. webscraping. Dit is perfect voor mijn javascript applicatie. Webscrapen met Puppeteer is niet veel anders dan met Selenium, dus ik bespaar je hier de details. Ik ga basically via de scraper naar de site, zoek op de input van de gebruiker, klik het eerste resultaat dat opkomt, kopieër de mp3 bron url en stuur deze terug.

#### Stap 11: making it all work together
Als laatste moet ik de HTML laten communiceren met de server en andersom. Dit doe ik via een POST request (van client naar server) en via renders met parameters (van server naar client). \
Tenslotte schrijf ik wat mooie css om het geheel presenteerbaar te maken.

### Installatie
1. git clone
2. npm install
3. node index.js
4. go to localhost:5000

### Bronnen:
[1. Stack Overflow post](https://en.wikipedia.org/wiki/Beat_detection) \
[2. Game Dev artikel](https://www.clear.rice.edu/elec301/Projects01/beat_sync/beatalgo.html) \
[3. Stack Overflow post](https://stackoverflow.com/questions/657073/how-to-detect-the-bpm-of-a-song-in-php) \
[4. Game Dev artikel](http://archive.gamedev.net/archive/reference/programming/features/beatdetection/index.html) \
[5. Stack Exchange post](https://sound.stackexchange.com/questions/27460/how-do-software-algorithms-to-calculate-bpm-usually-work) \
[6. Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) \
[7. Implement Tempo Detection](https://askmacgyver.com/blog/tutorial/how-to-implement-tempo-detection-in-your-application) \
[8. Beat Detection Algorithms](http://mziccard.me/2015/05/28/beats-detection-algorithms-1/) \
[9. ExpressJS Docs](https://expressjs.com/) \
[10. Puppeteer Git](https://github.com/GoogleChrome/puppeteer) \
[11. Puppeteer Docs](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md)
