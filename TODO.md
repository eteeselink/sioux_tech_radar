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
* Zien wat anderen vinden (4u)
* Expl eerst, daarna pas radar zelf (.html file renamen) (2u)
* Deploy
  * Nginx of IIS?
  * Adminer erbij (incl backup-db's?)

Totaal: 24 uur. Best flink, toch! Prio volgorde klopt zo.

OPEN ISSUES:
- Iemand voegt een thing toe die in een ander kwadrant al bestaat. Ojee!
  Optie: een naam mag maar 1x bestaan; degene die'm het eerst toevoegt krijgt'm in dat kwadrant
  Optie: elke naam mag in elk kwadrant bestaan. deze! iesh beter
  Oplossing: geen van twee, teveel gedoe. Revert!