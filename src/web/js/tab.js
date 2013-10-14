﻿var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var currentTab;
        function showTab(q) {
            currentTab = new Tab(q);
        }
        Client.showTab = showTab;
        var Tab = (function () {
            function Tab(q) {
                var _this = this;
                $('svg.radar').remove();
                var quad = (q === "all") ? null : Client.Quadrants[parseInt(q, 10)];
                var classes = "quadrant-" + q;
                if(quad !== null) {
                    classes += " single-quadrant";
                }
                this.radar = new Client.Radar(375, quad, (quad !== null), classes);
                if(Client.AuthInfo.instance.isLoggedIn()) {
                    Client.getThingsAndOpinions(quad).done(function (data) {
                        var things = data.things;
                        var opinions = data.opinions;
                        if(quad !== null) {
                            _this.thingsList = new Client.ThingList(_this, data.things, data.opinions, quad);
                            _this.initRant();
                        } else {
                            _this.showAllThings(data.opinions);
                        }
                        $('#rant-container').hide();
                    });
                }
            }
            Tab.prototype.addThing = function (thingname, quadrantnum) {
                var newThing = new Client.Thing(null, thingname, thingname + " has no description", quadrantnum);
                var dataforjson = JSON.stringify({
                    "Title": newThing.title,
                    "Description": newThing.description,
                    "Quadrantid": quadrantnum
                });
                return $.ajax({
                    url: "/api/things/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: dataforjson,
                    dataType: 'json'
                });
            };
            Tab.prototype.addOpinion = function (opinion) {
                var _this = this;
                this.radar.addOpinion(opinion);
                opinion.onSelect(function () {
                    return _this.selectOpinion(opinion);
                });
                opinion.onChange(function () {
                    return _this.updateRant(opinion);
                });
                if(opinion.existsOnServer) {
                    opinion.updateOpinion();
                } else {
                    opinion.existsOnServer = true;
                    opinion.storeNewOpinion();
                }
            };
            Tab.prototype.removeOpinion = function (opinion) {
                this.radar.removeOpinion(opinion);
                opinion.onSelect(null);
                opinion.existsOnServer = false;
                opinion.deleteOpinion();
            };
            Tab.prototype.showAllThings = function (opinions) {
                var _this = this;
                opinions.forEach(function (opinion) {
                    _this.addOpinion(opinion);
                });
            };
            Tab.prototype.selectOpinion = function (opinion) {
                if(opinion != this.currentOpinion) {
                    $('#rant-container').show();
                    this.updateRant(opinion);
                    $('#rant-subject').text(" over " + opinion.thing.title);
                    this.currentOpinion = opinion;
                }
            };
            Tab.prototype.initRant = function () {
                var _this = this;
                var textarea = $('#rant');
                textarea.change(function (ev) {
                    textarea.data('is-custom-rant', true);
                    _this.currentOpinion.rant = textarea.val();
                });
                textarea.on('blur', function (ev) {
                    console.log('blur');
                    if(textarea.data('is-custom-rant')) {
                        _this.currentOpinion.updateOpinion();
                        $('#rant-message').show().delay(2000).hide(600);
                    }
                });
            };
            Tab.prototype.getDefaultRant = function (goodness) {
                if(goodness < 0.20) {
                    return "Stevia moet gewoon in elk project gebruikt worden!";
                }
                if(goodness < 0.40) {
                    return "Eerst hield ik van Vanilla Ice. Toen kwam Stevia, en nu hou ik van Stevia én van Vanilla Ice!";
                }
                if(goodness < 0.55) {
                    return "Ik ben erg gecharmeerd van Stevia, en vind dat we het moeten uitproberen in een project";
                }
                if(goodness < 0.70) {
                    return "Volgens mij is Stevia wel de moeite waard om naar te kijken!";
                }
                if(goodness < 0.80) {
                    return "Stevia klinkt leuk, maar ik moet nog zien of het wat wordt.";
                }
                if(goodness < 0.90) {
                    return "Volgens mij is Stevia gebakken lucht.";
                }
                return "Stevia was in 1970 al een slecht idee, en dat is het nog steeds!";
            };
            Tab.prototype.updateRant = function (opinion) {
                var text = '';
                if(opinion.rant) {
                    text = opinion.rant;
                } else {
                    text = this.getDefaultRant(opinion.goodness());
                    text = text.replace("Stevia", opinion.thing.title);
                }
                var textarea = $('#rant');
                textarea.text(text);
            };
            return Tab;
        })();
        Client.Tab = Tab;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
