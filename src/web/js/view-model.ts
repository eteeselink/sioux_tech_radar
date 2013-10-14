/// <reference path="structs.ts" />
/// <reference path="radar.ts" />
/// <reference path="utils.ts" />
/// <reference path="auth.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {
    var deg45 = Math.PI / 4;

    /// Emulation of an "enum" with 4 elements. The good thing about
    /// faking an enum with a class and statics is that you can add methods, more
    /// like Java and less like C(#/++/)
    export class Quadrant extends Enum {
        constructor(public xloc: number, public yloc: number, public angle: number, public id: number) { super(Quadrant); }

        public static Techniques = new Quadrant(-1, -1, 3 * deg45, 0);
        public static Tools = new Quadrant(1, -1, 1 * deg45, 1);
        public static Languages = new Quadrant(1, 1, -1 * deg45, 2);
        public static Platforms = new Quadrant(-1, 1, -3 * deg45, 3);


        public angleLower() {
            return this.angle - deg45;
        }

        public angleUpper() {
            return this.angle + deg45;
        }

        public isLeft() {
            return this.xloc < 0;
        }

        public isTop() {
            return this.yloc < 0;
        }

    }

    export var Quadrants = [Quadrant.Techniques, Quadrant.Tools, Quadrant.Languages, Quadrant.Platforms];

    export class Thing {
        constructor(
          public name: string,
          public title: string,
          public description: string,
          public quadrantid: number, //double information about quadrant 	  
        ) { }

        public quadrant() {
            return Quadrants[this.quadrantid];
        }
    }

    /// View model for a "thing" that can be positioned at some place
    /// on the technology radar.
    export class Opinion extends D3Node {
        public onSelectCallback: Function = function () { };
        public onChangeCallback: Function = function () { };

        constructor(
              public thing: Thing,
            goodness: number,   // between 0.0 and 1.0; closer to zero is better		
              public rant: string,
        ) {
            super(null, null);
            this.setgoodness(goodness);
        }

        /// returns 'f' or the empty function if f is null
        private static functionify(f: Function) {
            return f || function () { };
        }

        /// Returns the CIRCLE element that this opinion belongs to (JQuery)
        public element(): JQuery {
            return $('#opinion_' + this.thing.name);
        }

        /// Pass null to unregister callback.
        public onSelect(callback: Function) {
            this.onSelectCallback = Opinion.functionify(callback);
        }

        /// Pass null to unregister callback.
        public onChange(callback: Function) {
            this.onChangeCallback = Opinion.functionify(callback);
        }


        public existsOnServer = false;
        private previousGoodness = goodness;

        private notifyServer() {
            // never talk to the server while dragging, it's a waste
            if (!this.isBeingDragged()) {

                var goodnessDiff = Math.abs(this.previousGoodness - this.goodness());
                if (isNaN(goodnessDiff) || !isFinite(goodnessDiff) || goodnessDiff <= 0.05) {
                    // also don't talk to the server if hardly anything changed.
                    return;
                }
                this.previousGoodness = this.goodness();
                this.updateOpinion();
            }

            this.onChangeCallback();
        }

        public deleteOpinion() {
            console.log("ajax (deleteOpinion) called");
            return $.ajax({
                url: "/api/opinions/" + AuthInfo.instance.username + "/" + encodeURIComponent(this.thing.name),
                type: 'DELETE',
                contentType: 'application/json',
                dataType: 'json'
            });
        }

        public updateOpinion() {
            console.log("ajax (updateOpinion) called");
            var opinion = {
                thingName: this.thing.name,
                rant: this.rant,
                goodness: this.goodness()
            }
            return this.store(opinion);
        }

        public storeNewOpinion() {
            console.log("ajax (storeNewOpinion) called");
            var opinion: Object = {
                thingName: this.thing.name,

                goodness: this.goodness()
            }
            return this.store(opinion);
        }

        private store(opinion: any) {
            return $.ajax({
                url: "/api/opinions/" + AuthInfo.instance.username + "/" + encodeURIComponent(opinion.thingName),
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(opinion),
                dataType: 'json'
            });
        }

        public polar: Polar;
        public prevPolar: Polar;

        public updatePolar() {
            this.prevPolar = this.polar;
            this.polar = Polar.fromPoint(this.x, this.y);
            this.notifyServer();
        }

        public fixRadius(goodnessEditable: bool) {
            if ((!this.isBeingDragged()) || (!goodnessEditable)) {
                this.polar.r = this.prevPolar.r;
                this.notifyServer();
            }
        }

        public updateXY() {
            this.x = this.polar.x();
            this.y = this.polar.y();
        }

        public isBeingDragged() {
            return (this.fixed & 2) !== 0;
        }
        public goodness() {
            return this.polar.r / Radar.radius;
        }

        public setgoodness(goodness: number) {
            var r = goodness * Radar.radius;
            var phi = this.thing.quadrant().angle + random(0.01, 0.02);
            this.polar = new Polar(r, phi);
            this.updateXY();
        }
    }
}
