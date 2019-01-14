# BPM_Detector

### Proof of Concept voor Web Research: BPM Detector
Als proof of concept voor Web Research wil ik een BPM detector maken. Dit gaat een web applicatie zijn waarbij je een liedje kan uploaden of online kan selecteren via webscraping. Dan gaat er een algoritme het tempo bepalen van het liedje en dit tonen in de app.

#### Stap 1: research en stappenplan
Eerst moet ik natuurlijk opzoeken wat een beat detectie algoritme doet om een tempo te bepalen. Hiervoor heb ik meerdere bronnen geraadpleegd. Hierdoor heb ik een goed begrip gekregen van hoe zo'n algoritme werkt. In grote lijnen:
1. Het tempo van een liedje wordt (in de meeste liedjes) bepaald door de kickdrum. Dit is technisch gezien lage frequencies die ritmisch voorkomen.
2. Het liedje moet door een "lowpass" filter gehaalt worden. Dit filtert de hoge frequencies uit het liedje zodat je enkel nog de lage over hebt, de frequencies die van nut zijn voor tempo detectie.
3. Hierna kies je een klein stukje (of meerdere stukjes) uit het liedje dat je wilt analyseren. Dit zijn liefste stukjes uit het refrein of chorus waar het tempo het duidelijkst is. Vermijdt intro's, outro's en strofes die geen duidelijke lage frequencies hebben.
4. Ookal pak je een stuk van 10 seconden, meeste liedjes hebben een sample rate van 44100. Dit is teveel data om te analyseren. Dus de volgende stap is je stuk downsamplen. Dit betekend onnodige data uit het stuk halen. Downsamplen helpt ook met random pieken uit het stuk te halen, dit vergemakkelijkt het detecteren van pieken in een latere stap.
5. Als je naar de waveform kijkt die we nu hebben, zie je aan beide kanten van de x-as pieken. We hebben eigenlijk maar 1 zo'n kant nodig. Hiervoor moet je je stuk "normaliseren". \
Voor: \
![Waveform1](https://i.imgur.com/RYlCOD4.png) \
Na: \
![Waveform2](https://i.imgur.com/GUHNPSK.png)
6. Na het normaliseren zet je een threshold op je waveform, dit is een volume level die we gaan gebruiken om de hoogste pieken te isoleren en te tellen.
7. Dit gaan we dus doen, vervolgens tel je het aantal pieken die boven de threshold uitsteken en hiermee kan je een tempo berekenen.

#### Stap 2: liedje binnenhalen via webscraping
Ik heb besloten om de gebruiker een liedje naar keuze te laten invoeren. Deze input wordt gewebscraped van een site die mp3 files host. Deze mp3 kan dan met een GET request worden binnengehaald in de webapp en kan gebruikt worden voor de rest van het proces. \

#### Stap 3: de lowpass filter

#### Stap 4: sample selecteren

#### Stap 5: downsampling

#### Stap 6: normaliseren

#### Stap 7: threshold en pieken tellen

#### Stap 8: tempo berekenen




#### Bronnen:
[1. Stack Overflow post](https://en.wikipedia.org/wiki/Beat_detection) \
[2. Game Dev artikel](https://www.clear.rice.edu/elec301/Projects01/beat_sync/beatalgo.html) \
[3. Stack Overflow post](https://stackoverflow.com/questions/657073/how-to-detect-the-bpm-of-a-song-in-php) \
[4. Game Dev artikel](http://archive.gamedev.net/archive/reference/programming/features/beatdetection/index.html) \
[5. Stack Exchange post](https://sound.stackexchange.com/questions/27460/how-do-software-algorithms-to-calculate-bpm-usually-work) \
[6. Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) \
[7. Implement Tempo Detection](https://askmacgyver.com/blog/tutorial/how-to-implement-tempo-detection-in-your-application) \
[8. Beat Detection Algorithms](http://mziccard.me/2015/05/28/beats-detection-algorithms-1/) \
