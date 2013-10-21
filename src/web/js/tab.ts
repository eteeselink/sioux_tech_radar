/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="thing-list.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {

    /// Encapsulates all data shown on the currently selected tab
    /// (e.g. either a quadrant or the overview screen)
    /// Don't call the constructor; call Tab.show() instead.
    export class Tab {

        private static currentTab: Tab;

        /// `q` must be the name of a quadrant or 'all'.
        public static show(q: string) {
            currentTab = new Tab(q);
        }

        private hasEverHadAnOpinion = false;
        private thingsList: ThingList;
        private radar: Radar;
        private currentOpinion: Opinion;
        private quadrant: Quadrant;
        private isOverview() { return this.quadrant === null; }

        /// Called by `show` whenever we switch to a new tab. 
        /// Switching tab means creating a new tab object.
        constructor(q: string) {

            // remove earlier radars, if any.
            $('svg.radar').remove();

            this.quadrant = (q === "all") ? null : Quadrants[parseInt(q, 10)];
            var classes = "quadrant-" + q;
            if (!this.isOverview()) {
                classes += " single-quadrant";
            }
            $('body')
                .removeClass('single-quadrant all-quadrants')
                .addClass(this.isOverview() ? 'all-quadrants' : 'single-quadrant');

            var diameter = (this.isOverview()) ? 500 : 375;
            this.radar = new Radar(diameter, this.quadrant, !this.isOverview(), classes);
            this.unselectOpinion();
            if (AuthInfo.instance.canGetUserData()) {
                var request = getThingsAndOpinions(this.quadrant);
                request.done((data: { things: Thing[]; opinions: Opinion[]; }) => {
                    var things = data.things;
                    var opinions = data.opinions;

                    if (opinions.length > 0) {
                        this.hasEverHadAnOpinion = true;
                    }

                    if (this.isOverview()) {
                        this.unselectOpinion();
                        this.showAllThings(data.opinions);
                        ThingList.remove();
                    }
                    else {
                        // (re)create the interactive thing list, which allows additions 
                        // and removals to the radar
                        this.thingsList = new ThingList(this, data.things, data.opinions, this.quadrant);
                        this.initDesc();
                    }
                    this.initRant();
                });
            }

        }

        public hasActiveSelection() {
            return this.currentOpinion !== null;
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
            opinion.onSelect(() => this.onOpinionSelected(opinion));
            opinion.onMove(() => this.onOpinionMoved(opinion));
            opinion.onChange(() => this.onOpinionChanged(opinion));

            //  TODO: maybe this logic belongs in the Opinion class?
            if (!opinion.existsOnServer) {
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

        public countOpinions() {
            return this.radar.countOpinions();
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
            $('#desc-overlay-container').hide();
        }

        /// Select this opinion. Emulates a click on a circle
        public selectOpinion(opinion: Opinion) {
            this.radar.select(opinion);
        }

        /// Called when the user clicks on a circle in the radar.
        /// Sets this opinion as the current opinion and updates the desc/rant areas
        /// accordingly.
        private onOpinionSelected(opinion: Opinion) {
            
            if (opinion == this.currentOpinion) return;

            if (this.isOverview()) {
                if (opinion.rant) {
                    $('#rant-container').show();
                    this.updateRant(opinion);
                }
                else {
                    $('#rant-container').hide();
                }
            }
            else {
                if (this.hasEverHadAnOpinion) {
                    $('#rant-container').show();
                }
                // no else clause: the container is only shown *after* the user has 
                // moved an opinion the first time.
            
                this.updateRant(opinion);
            }
            
            $('#rant-subject').text(" over " + opinion.thing.title);
            this.currentOpinion = opinion;

            // slightly readonly-fy the layout for the overview

            if (this.isOverview()) {
                $('.rant-why').hide();
                $('#rant').hide();
                $('#readonly-rant').show();
                this.showDescOverlay(opinion.thing);
            }
            else {
                $('.rant-why').show();
                $('#rant').show();
                $('#readonly-rant').hide();
                this.showDesc(opinion.thing)
            }

        }

        private onOpinionMoved(opinion: Opinion) {
            this.updateRant(opinion);
        }

        private onOpinionChanged(opinion: Opinion) {
            if (!this.hasEverHadAnOpinion) {
                $('#rant-container').fadeIn(400);
                $('#desc-container').fadeIn(400);
            }
            this.hasEverHadAnOpinion = true;
        }

        /// Show 'selector' for 2 seconds, then fade out.
        private flash(selector) {
            $(selector)
                .show()
                .delay(2000)
                .fadeOut(600);
        }

        /// hook up appropriate event handlers on the 'rant' area
        private initRant() {

            var textarea = $('#rant');
            textarea.unbind();
            textarea.data('is-custom-rant', false);

            if (!this.isOverview()) {

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
        }

        private getDefaultRant(goodness) {
            if (goodness < 0.20) return "Yakult moet gewoon in elk project gebruikt worden!";
            if (goodness < 0.40) return "Eerst hield ik van Vanilla Ice. Toen kwam Yakult, en nu hou ik van Yakult én van Vanilla Ice!";
            if (goodness < 0.55) return "Ik ben erg gecharmeerd van Yakult, en vind dat we het moeten uitproberen in een project";
            if (goodness < 0.70) return "Volgens mij is Yakult wel de moeite waard!";
            if (goodness < 0.80) return "Yakult klinkt leuk, maar ik moet nog zien of het wat wordt.";
            if (goodness < 0.90) return "Volgens mij is Yakult gebakken lucht.";
            return "Yakult was in 1970 al een slecht idee, en dat is het nog steeds!";
        }

        private getRantQuestion(goodness) {
            if (goodness < 0.40) return "Waarom vind jij dat we vaak wat met Yakult moeten doen?";
            if (goodness < 0.70) return "Waarom vind jij dat we Yakult in een project moeten proberen?";
            if (goodness < 0.85) return "Waarom vind jij dat we met Yakult moeten experimenteren?";
            return "Waarom vind jij dat we van Yakult af moeten blijven?";
        }

        private textForGoodness(opinion: Opinion, func: (double) => string) {
            var text = func(opinion.goodness());
            return text.replace(/Yakult/g, opinion.thing.title);
        }

        public updateRant(opinion: Opinion) {

            var text = '';
            if (opinion.rant) {
                text = opinion.rant;
            }
            else {
                text = this.textForGoodness(opinion, this.getDefaultRant);
            }

            $('#rant').val(text);
            $('#readonly-rant').text(text);

            var question = this.textForGoodness(opinion, this.getRantQuestion);
            $('#rant-why-question').text(question);
            $('#rant-name').text(AuthInfo.instance.username);
        }


        public showDesc(thing: Thing) {
            if (this.hasEverHadAnOpinion) {
                $('#desc-container').show();
            }
            // no else clause: the container is only shown *after* the user has 
            // moved an opinion the first time.

            $('#desc-subject').text(thing.title);
            $('#desc').val(thing.description);
        }

        /// Show the read-only description overlay of a particular thing.
        /// Called by ThingList or in the overview screen.
        public showDescOverlay(thing: Thing) {
            var description = thing.description;
            if (!description || description.trim() === "") {
                $('#desc-overlay').html("<i>Niemand heeft nog wat over " + thing.title + " geschreven</i>");
            }
            else {
                $('#desc-overlay').text(description);
            }

            $('#desc-overlay-subject').text(thing.title);
            $('#desc-overlay-container').show();

            // temporarily hide the description form of the currently selected opinion, if applicable.
            // keep track that we want to restore it in onMouseOut
            var desc = $('#desc-container');
            if (this.hasActiveSelection()) {
                desc.hide();
            }
        }

        /// hook up appropriate event handlers on the 'desc' area
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
    }
}