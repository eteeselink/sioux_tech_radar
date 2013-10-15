/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="thing-list.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {

    /// global singleton tab object.
    var currentTab: Tab;
    
    export function showTab(q: string) {
        currentTab = new Tab(q);
    }

    /// Encapsulates all data shown on the currently selected tab
    /// (e.g. either a quadrant or the overview screen)
    export class Tab {

        private thingsList: ThingList;
        private radar: Radar;
        private currentOpinion: Opinion;


        constructor(q: string) {

            // remove earlier radars, if any.
            $('svg.radar').remove();

            var quad = (q === "all") ? null : Quadrants[parseInt(q, 10)];
            var classes = "quadrant-" + q;
            if (quad !== null) {
                classes += " single-quadrant";
            }
            this.radar = new Radar(375, quad, (quad !== null), classes);
            if (AuthInfo.instance.isLoggedIn()) {
                getThingsAndOpinions(quad).done((data: { things: Thing[]; opinions: Opinion[]; }) => {
                    var things = data.things;
                    var opinions = data.opinions;

                    if (quad !== null) {
                        // recreate the interactive thing list, which allows additions and removals to the radar
                        this.thingsList = new ThingList(this, data.things, data.opinions, quad);
                        this.initRant();
                        this.initDesc();
                    } else {
                        this.showAllThings(data.opinions);
                    }
                    $('#rant-container').hide();
                    $('#desc-container').hide();
                });
            }

        }

        /// Creates a new Thing on the server. Returns a promise with as a single argument all
        /// data fields (name, title, etc) of the newly created thing. Notably, this means that the
        /// server chooses how a thing's title is turned into a name.
        public addThing(thingname: string, quadrantnum: number) {
            var newThing = new Thing(null, thingname, "", quadrantnum); // random(0.1, 1.0)

            var dataforjson = JSON.stringify({ "Title": newThing.title, "Description": newThing.description, "Quadrantid": quadrantnum });

            return $.ajax({
                url: "/api/things/",
                type: 'POST',
                contentType: 'application/json',
                data: dataforjson,
                dataType: 'json'
            });
        }

        public addOpinion(opinion: Opinion) {
            this.radar.addOpinion(opinion);
            opinion.onSelect(() => this.selectOpinion(opinion));
            opinion.onChange(() => this.updateRant(opinion));

            //  TODO: maybe this logic belongs in the Opinion class, by refactoring
            // updateOpinion and storeNewOpinion into a single save() method?
            if (opinion.existsOnServer) {
                opinion.updateOpinion();
            } else {
                opinion.existsOnServer = true;
                opinion.storeNewOpinion();
            }
        }


        public removeOpinion(opinion: Opinion) {
            if (this.currentOpinion === opinion) {
                this.unselectOpinion();
            }
            this.radar.removeOpinion(opinion);
            opinion.onSelect(null);
            opinion.existsOnServer = false; // not sure how much sense this makes, i guess the opinion object is gone for good now.
            opinion.deleteOpinion();
        }

        /// Shows the things for the overview tab, of all four quadrants
        public showAllThings(opinions: Opinion[]) {
            opinions.forEach(opinion => {
                this.addOpinion(opinion);
            });
        }

        public unselectOpinion() {
            this.currentOpinion = null;
            $('#rant-container').hide();
            $('#desc-container').hide();
        }

        public selectOpinion(opinion: Opinion) {
            
            if (opinion != this.currentOpinion) {
                $('#rant-container').show();

                this.updateRant(opinion);
                this.showDesc(opinion.thing)
                $('#rant-subject').text(" over " + opinion.thing.title);
                this.currentOpinion = opinion;
            }
        }

        private flash(selector) {
            $(selector)
                .show()
                .delay(2000)
                .fadeOut(600);
        }

        private initRant() {

            var textarea = $('#rant');
            textarea.unbind();
            textarea.change(ev => {
                textarea.data('is-custom-rant', true);
                this.currentOpinion.rant = textarea.val();
            });
            textarea.on('blur', ev => {
                console.log('blur');
                if (textarea.data('is-custom-rant')) {
                    var req = this.currentOpinion.updateOpinion();
                    req.done(() => this.flash('#rant-message'));
                    alertOnFail(req);
                }
            });
        }

        private initDesc() {
            var form = $('#desc-form');
            form.unbind();
            form.submit(ev => {
                var thing = this.currentOpinion.thing;
                thing.description = $('#desc').val();

                var req = thing.updateDescription();
                req.done(() => this.flash('#desc-message'));
                alertOnFail(req);
                return false;
            });
        }

        private getDefaultRant(goodness) {
            if (goodness < 0.20) return "Yakult moet gewoon in elk project gebruikt worden!";
            if (goodness < 0.40) return "Eerst hield ik van Vanilla Ice. Toen kwam Yakult, en nu hou ik van Yakult én van Vanilla Ice!";
            if (goodness < 0.55) return "Ik ben erg gecharmeerd van Yakult, en vind dat we het moeten uitproberen in een project";
            if (goodness < 0.70) return "Volgens mij is Yakult wel de moeite waard om naar te kijken!";
            if (goodness < 0.80) return "Yakult klinkt leuk, maar ik moet nog zien of het wat wordt.";
            if (goodness < 0.90) return "Volgens mij is Yakult gebakken lucht.";
            return "Yakult was in 1970 al een slecht idee, en dat is het nog steeds!";
        }

        public updateRant(opinion: Opinion) {
            var text = '';
            if (opinion.rant) {
                text = opinion.rant;
            }
            else {
                text = this.getDefaultRant(opinion.goodness());
                text = text.replace(/Yakult/g, opinion.thing.title);
            }
            var textarea = $('#rant');
            textarea.text(text);
        }

        private showDesc(thing: Thing) {
            $('#desc-container').show();
            $('#desc-subject').text(thing.title);
            $('#desc').val(thing.description);
        }
    }



}