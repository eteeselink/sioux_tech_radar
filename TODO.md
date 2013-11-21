New TODO d.d. 28-07-2013
========================

+ UX: (4u)
  + Add dialog werkt niet lekker
  + Add knop onderaan lijstje
  - "Add" is buggy (niet fixen, lijkt opera-only)
+ Rant: geen interactie, "undefined" (4u)
  + Gewenst: zodra je een ding versleept wordt een doorsnee rant automatisch ingevuld
+ Wiki-achtige uitleg over item 
  + Moet ook nog gedesigned worden (2u)
  + En gemaakt (4u)
+ Maximum 5 items per kwadrant
- Data-problemen
  - Als mensen troep toevoegen, is dat niet gemakkelijk te verwijderen (oplossen met Adminer)
  - Als iemand 1x "blabloe" toevoegt aan "Languages", kan dat nooit meer elders worden gezet (oplossen met Adminer)
+ DB backup
+ Overzichtsradar laten zien  
* Je eigen overzichtsradar delen (4u)
  * Open issue: de openbare radar probeert PUT te doen. Waarom?
- Zien wat anderen vinden (4u)
+ Expl eerst, daarna pas radar zelf (.html file renamen) (2u)


+ Deploy
  + .net 4.5 erin
  + git pull
  + msbuild aanroepen (release)
  + build\nginx_service.exe install
  + src\server\bin\Release\backend_service.exe install
  + php-fcgi in windows startup en achter nginx hangen -> adminer.php


OPEN ISSUES:
- Iemand voegt een thing toe die in een ander kwadrant al bestaat. Ojee!
  Optie: een naam mag maar 1x bestaan; degene die'm het eerst toevoegt krijgt'm in dat kwadrant
  Optie: elke naam mag in elk kwadrant bestaan. deze! iesh beter
  Oplossing: geen van twee, teveel gedoe. Revert!
  
* kwadrantnaam bij radar
+ bug: thing-name in desc verandert niet altijd goed mee
+ bug: overzichtsradar-veld is niet breed genoeg