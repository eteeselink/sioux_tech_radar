/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="thing-list.ts" />
/// <reference path="techradar.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {


    export class Tab {

        private thingsList: ThingList;

        constructor(q: string) {

            // remove earlier radars, if any.
            $('svg.radar').remove();

            var quad = (q === "all") ? null : Quadrants[parseInt(q, 10)];
            var classes = "quadrant-" + q;
            if (quad !== null) {
                classes += " single-quadrant";
            }
            var radar = new Radar(375, quad, (quad !== null), classes);
            if (AuthInfo.instance.isLoggedIn()) {
                getThingsAndOpinions(quad).done((data: { things: Thing[]; opinions: Opinion[]; }) => {
                    var things = data.things;
                    var opinions = data.opinions;

                    if (quad !== null) {
                        // recreate the interactive thing list, which allows additions and removals to the radar
                        this.thingsList = new ThingList(this, data.things, data.opinions, quad, radar);

                    } else {
                        this.showAllThings(data.opinions, radar);

                    }
                });
            }

        }

        /// Creates a new Thing on the server. Returns a promise with as a single argument all
        /// data fields (name, title, etc) of the newly created thing. Notably, this means that the
        /// server chooses how a thing's title is turned into a name.
        public addThing(thingname: string, quadrantnum: number) {
            var newThing = new Thing(null, thingname, thingname + " has no description", quadrantnum); // random(0.1, 1.0)

            var dataforjson = JSON.stringify({ "Title": newThing.title, "Description": newThing.description, "Quadrantid": quadrantnum });

            return $.ajax({
                url: "/api/things/",
                type: 'POST',
                contentType: 'application/json',
                data: dataforjson,
                dataType: 'json'
            });
        }

        public addOpinion(opinion: Opinion, radar: Radar) {
            radar.addOpinion(opinion);
            opinion.onChange(() => expandRant(opinion));

            //  TODO: maybe this logic belongs in the Opinion class, by refactoring
            // updateOpinion and storeNewOpinion into a single save() method?
            if (opinion.existsOnServer) {
                opinion.updateOpinion();
            } else {
                opinion.existsOnServer = true;
                opinion.storeNewOpinion();
            }
        }


        public removeOpinion(opinion: Opinion, radar: Radar) {
            radar.removeOpinion(opinion);
            opinion.onChange(null);
            opinion.existsOnServer = false; // not sure how much sense this makes, i guess the opinion object is gone for good now.
            opinion.deleteOpinion();
        }

        /// Shows the things for the overview tab, of all four quadrants
        public showAllThings(opinions: Opinion[], radar: Radar) {
            opinions.forEach(opinion => {
                this.addOpinion(opinion, radar);
            });
        }
    }


    function expandRant(opinion: Opinion) {
        console.log(opinion.thing.title);
        var el = $('#collapse' + opinion.thing.name);
        console.log(el);
        (<any>el).collapse('show');
    }

}