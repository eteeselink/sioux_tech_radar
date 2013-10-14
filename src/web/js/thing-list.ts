/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="techradar.ts" />
/// <reference path="tab.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {

    export class ThingList {
        private container: JQuery;

        constructor(
            private tab: Tab,
            private things: Thing[],
            private opinions: Opinion[],
            private quadrant: Quadrant,
            private radar: Radar
        ) {
            $('#thingsList').remove();

            var parentContainer = $('<div id="thingsList" class="thing-list-left">');
            this.container = $('<div class=" btn-group  btn-group-vertical" data-toggle="buttons-checkbox">');

            this.drawThingButtons();

            var selectedOpinions = this.opinions.filter(o => o.thing.quadrant() === this.quadrant);
            this.addOpinions(selectedOpinions);

            // add handlers for thing-button clicks.
            this.container.find('.thingButton').click(ev => this.onButtonClick(ev));

            ////section for adding rants    
            //buildRantList(selectedOpinions);

            parentContainer.append(this.container);
            $('#contents').append(parentContainer);

            this.drawAddThingButton();
        }

        private onButtonClick(ev: Event) {
            var button = $(ev.target);
            var thingname = button.data('thing');
            var thing = findThing(thingname, this.things);

            if (thing == null) {
                alert("Programmer bug! Amount of things matched to button unexpected.");
                throw new Error("Programmer bug! Amount of things matched to button unexpected.")
            }

            if (!button.hasClass('active')) {
                // create a new opinion object and add it to the radar. store the object with the button.
                var opinion = new Opinion(thing, random(0.0, 1.0), "");
                button.data('opinion', opinion);
                this.tab.addOpinion(opinion, this.radar);
                //buildRantList(selectedOpinions);

            } else {
                // get the opinion object back from the button, and remove it everywhere.
                var opinion: Opinion = button.data('opinion');
                this.tab.removeOpinion(opinion, this.radar);
                button.data('opinion', null);
            }
        }

        private drawThingButtons() {
            var selectedThings = this.things.filter(o => o.quadrant() === this.quadrant);
            selectedThings.forEach(thing => {
                this.container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
            });
        }

        /**
         * Adds opinions to radar and sets thing-button state accordingly.
         */
        private addOpinions(selectedOpinions: Opinion[]) {
            selectedOpinions.forEach(opinion => {
                var button = this.container.find('.thingButton[data-thing=\'' + opinion.thing.name + '\']');
                button.addClass("active");
                button.data("opinion", opinion); // tie the Opinion object directly to the Button element, using jQuery. This way, we never lose it.
                this.tab.addOpinion(opinion, this.radar)
            });

        }

        private drawAddThingButton() {
            $('#thingsList').append('<div><input type="text" id="thing-add-title"><button class="btn" id="thing-add-submit">+</button></div>');

            $('#thing-add-submit').click(ev => {
                var request = this.tab.addThing($('#thing-add-title').val(), this.quadrant.id);

                request.done(thing => {
                    this.container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
                    showTab(this.quadrant.id.toString());
                });

                alertOnFail(request);
                ev.preventDefault();
            });
        }
    }
}