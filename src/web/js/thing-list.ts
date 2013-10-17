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

        public static remove() {
            $('#thingsList').remove();
        }

        constructor(
            private tab: Tab,
            private things: Thing[],
            private opinions: Opinion[],
            private quadrant: Quadrant
        ) {
            ThingList.remove();

            var parentContainer = $('<div id="thingsList" class="thing-list-left">');
            this.container = $('<div class=" btn-group  btn-group-vertical" data-toggle="buttons-checkbox">');

            this.drawThingButtons();

            var selectedOpinions = this.opinions.filter(o => o.thing.quadrant() === this.quadrant);
            this.addOpinions(selectedOpinions);

            // add handlers for thing-button clicks.
            var buttons = this.container.find('.thingButton');
            buttons.click(ev => this.onButtonClick(ev));
            buttons.mouseover(ev => this.onMouseOver(ev));
            buttons.mouseout(ev => this.onMouseOut(ev));

            ////section for adding rants    
            //buildRantList(selectedOpinions);

            parentContainer.append(this.container);
            $('#contents').append(parentContainer);

            this.drawAddThingButton();
        }

        private findThing(button: JQuery) {
            var thingname = button.data('thing');
            return findThing(thingname, this.things);
        }

        private onMouseOver(ev: Event) {
            var button = $(ev.target);
            var thing = this.findThing(button);

            this.tab.showDescOverlay(thing);
        }

        private onMouseOut(ev: Event) {
            var button = $(ev.target);
            var thing = this.findThing(button);

            $('#desc-overlay-container').hide();

            // restore the description form of the currently selected opinion, if applicable.
            var desc = $('#desc-container');
            if (this.tab.hasActiveSelection()) {
                desc.show();
            }
        }

        private onButtonClick(ev: Event) {
            var button = $(ev.target);
            var thing = this.findThing(button);

            if (thing == null) {
                showAlert("Programmer bug! Amount of things matched to button unexpected.");
                throw new Error("Programmer bug! Amount of things matched to button unexpected.")
            }

            if (!button.hasClass('active')) {

                if (this.tab.countOpinions() >= 5) {
                    showAlert("Je mag maximaal 5 meningen geven per onderwerp. Kies de belangrijkste uit!");
                    return false;
                }

                // create a new opinion object and add it to the radar. store the object with the button.
                var opinion = new Opinion(thing, random(0.0, 1.0), "");
                button.data('opinion', opinion);
                this.tab.addOpinion(opinion);
                
                // we immediately auto-select newly added opinion for UX reasons, so that rant and desc areas
                // appear at an "expected" time(after a button click), and not only when a circle is
                // clicked(which feels like a less - heavy operation)
                this.tab.selectOpinion(opinion);

            } else {
                // get the opinion object back from the button, and remove it everywhere.
                var opinion: Opinion = button.data('opinion');
                this.tab.removeOpinion(opinion);
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
                this.tab.addOpinion(opinion)
            });

        }

        private drawAddThingButton() {
            $('#thingsList').append('<div><input type="text" id="thing-add-title"><button class="btn" id="thing-add-submit">+</button></div>');

            $('#thing-add-submit').click(ev => {
                var request = this.tab.addThing($('#thing-add-title').val(), this.quadrant.id);

                request.done(thing => {
                    this.container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
                    Tab.show(this.quadrant.id.toString());
                });

                alertOnFail(request);
                ev.preventDefault();
            });
        }
    }
}