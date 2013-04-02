Inleiding
---------

Hier speccen we vrij formeel hoe de client-server API eruit moet zien.
Mijn voorstel is dat we hierop sparren (evt via pull requests) maar dit
document weggooien zodra hetzelfde in ServiceStack gespect staat.


Datastructuren
--------------

Onderstaande is gespect in een JSON-API-spec formaat, geinspireerd door 
JSON zelf en Relax NG. Best aardig, toch?


    Opinions [
      Opinion*           // in practice: never more than 5
    ]

    Opinion {
      Number score       // floating point, between 0.0 and 1.0
      String rant        
      String thing_title 
    }

    Things [
      Thing*
    ]

    Thing {
      String title 
      String name        // lowercase-no-interpunction version of title
      String desc
      Number quandrant_id
    }


### Aannames die volgen uit bovenstaande:

* Things hebben geen id, alleen een title
* Things zijn immutable, muv veld "desc"


API calls
---------

* GET Opinions (String quadrant)
* PUT Opinions (String quadrant)
* GET Things (String quadrant)

Ronald mag de URLs bedenken die bij deze calls horen :-)


Later toevoegen
---------------

### Datastructuren

* `Person` class
* Veld `person_id` aan opinion

### API calls

* POST Thing (String quadrant)
* PUT ThingDescription (String thing_title)
