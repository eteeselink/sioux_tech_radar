var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var Tab = (function () {
            function Tab(q) {
                var _this = this;
                this.hasEverHadAnOpinion = false;
                $('svg.radar').remove();
                this.quadrant = (q === "all") ? null : Client.Quadrants[parseInt(q, 10)];
                var classes = "quadrant-" + q;
                if(!this.isOverview()) {
                    classes += " single-quadrant";
                }
                $('body').removeClass('single-quadrant all-quadrants').addClass(this.isOverview() ? 'all-quadrants' : 'single-quadrant');
                var diameter = (this.isOverview()) ? 500 : 375;
                this.radar = new Client.Radar(diameter, this.quadrant, !this.isOverview(), classes);
                this.unselectOpinion();
                if(Client.AuthInfo.instance.isLoggedIn()) {
                    var request = Client.getThingsAndOpinions(this.quadrant);
                    request.done(function (data) {
                        var things = data.things;
                        var opinions = data.opinions;
                        if(opinions.length > 0) {
                            _this.hasEverHadAnOpinion = true;
                        }
                        if(_this.isOverview()) {
                            _this.unselectOpinion();
                            _this.showAllThings(data.opinions);
                            Client.ThingList.remove();
                        } else {
                            _this.thingsList = new Client.ThingList(_this, data.things, data.opinions, _this.quadrant);
                            _this.initDesc();
                        }
                        _this.initRant();
                    });
                }
            }
            Tab.show = function show(q) {
                Tab.currentTab = new Tab(q);
            };
            Tab.prototype.isOverview = function () {
                return this.quadrant === null;
            };
            Tab.prototype.hasActiveSelection = function () {
                return this.currentOpinion !== null;
            };
            Tab.prototype.addThing = function (thingname, quadrantnum) {
                var newThing = new Client.Thing(null, thingname, "", quadrantnum);
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
                    return _this.onOpinionSelected(opinion);
                });
                opinion.onMove(function () {
                    return _this.onOpinionMoved(opinion);
                });
                opinion.onChange(function () {
                    return _this.onOpinionChanged(opinion);
                });
                if(opinion.existsOnServer) {
                    opinion.updateOpinion();
                } else {
                    opinion.existsOnServer = true;
                    opinion.storeNewOpinion();
                }
            };
            Tab.prototype.removeOpinion = function (opinion) {
                if(this.currentOpinion === opinion) {
                    this.unselectOpinion();
                }
                this.radar.removeOpinion(opinion);
                opinion.onSelect(null);
                opinion.existsOnServer = false;
                opinion.deleteOpinion();
            };
            Tab.prototype.countOpinions = function () {
                return this.radar.countOpinions();
            };
            Tab.prototype.showAllThings = function (opinions) {
                var _this = this;
                opinions.forEach(function (opinion) {
                    _this.addOpinion(opinion);
                });
            };
            Tab.prototype.unselectOpinion = function () {
                this.currentOpinion = null;
                $('#rant-container').hide();
                $('#desc-container').hide();
                $('#desc-overlay-container').hide();
            };
            Tab.prototype.selectOpinion = function (opinion) {
                this.radar.select(opinion);
            };
            Tab.prototype.onOpinionSelected = function (opinion) {
                if(opinion == this.currentOpinion) {
                    return;
                }
                if(this.hasEverHadAnOpinion) {
                    $('#rant-container').show();
                }
                this.updateRant(opinion);
                $('#rant-subject').text(" over " + opinion.thing.title);
                this.currentOpinion = opinion;
                if(this.isOverview()) {
                    $('.rant-why').hide();
                    $('#rant').hide();
                    $('#readonly-rant').show();
                    this.showDescOverlay(opinion.thing);
                } else {
                    $('.rant-why').show();
                    $('#rant').show();
                    $('#readonly-rant').hide();
                    this.showDesc(opinion.thing);
                }
            };
            Tab.prototype.flash = function (selector) {
                $(selector).show().delay(2000).fadeOut(600);
            };
            Tab.prototype.initRant = function () {
                var _this = this;
                var textarea = $('#rant');
                textarea.unbind();
                textarea.data('is-custom-rant', false);
                if(!this.isOverview()) {
                    textarea.change(function (ev) {
                        textarea.data('is-custom-rant', true);
                        _this.currentOpinion.rant = textarea.val();
                    });
                    textarea.on('blur', function (ev) {
                        console.log('blur');
                        if(textarea.data('is-custom-rant')) {
                            var req = _this.currentOpinion.updateOpinion();
                            req.done(function () {
                                return _this.flash('#rant-message');
                            });
                            Client.alertOnFail(req);
                        }
                    });
                }
            };
            Tab.prototype.getDefaultRant = function (goodness) {
                if(goodness < 0.20) {
                    return "Yakult moet gewoon in elk project gebruikt worden!";
                }
                if(goodness < 0.40) {
                    return "Eerst hield ik van Vanilla Ice. Toen kwam Yakult, en nu hou ik van Yakult én van Vanilla Ice!";
                }
                if(goodness < 0.55) {
                    return "Ik ben erg gecharmeerd van Yakult, en vind dat we het moeten uitproberen in een project";
                }
                if(goodness < 0.70) {
                    return "Volgens mij is Yakult wel de moeite waard om naar te kijken!";
                }
                if(goodness < 0.80) {
                    return "Yakult klinkt leuk, maar ik moet nog zien of het wat wordt.";
                }
                if(goodness < 0.90) {
                    return "Volgens mij is Yakult gebakken lucht.";
                }
                return "Yakult was in 1970 al een slecht idee, en dat is het nog steeds!";
            };
            Tab.prototype.getRantQuestion = function (goodness) {
                if(goodness < 0.40) {
                    return "Waarom vind jij dat we vaak wat met Yakult moeten doen?";
                }
                if(goodness < 0.70) {
                    return "Waarom vind jij dat we Yakult in een project moeten proberen?";
                }
                if(goodness < 0.85) {
                    return "Waarom vind jij dat we met Yakult moeten experimenteren?";
                }
                return "Waarom vind jij dat we van Yakult af moeten blijven?";
            };
            Tab.prototype.textForGoodness = function (opinion, func) {
                var text = func(opinion.goodness());
                return text.replace(/Yakult/g, opinion.thing.title);
            };
            Tab.prototype.updateRant = function (opinion) {
                var text = '';
                if(opinion.rant) {
                    text = opinion.rant;
                } else {
                    text = this.textForGoodness(opinion, this.getDefaultRant);
                }
                $('#rant').val(text);
                $('#readonly-rant').text(text);
                var question = this.textForGoodness(opinion, this.getRantQuestion);
                $('#rant-why-question').text(question);
            };
            Tab.prototype.onOpinionMoved = function (opinion) {
                this.updateRant(opinion);
            };
            Tab.prototype.onOpinionChanged = function (opinion) {
                if(!this.hasEverHadAnOpinion) {
                    $('#rant-container').fadeIn(400);
                    $('#desc-container').fadeIn(400);
                }
                this.hasEverHadAnOpinion = true;
            };
            Tab.prototype.showDesc = function (thing) {
                if(this.hasEverHadAnOpinion) {
                    $('#desc-container').show();
                }
                $('#desc-subject').text(thing.title);
                $('#desc').val(thing.description);
            };
            Tab.prototype.showDescOverlay = function (thing) {
                var description = thing.description;
                if(!description || description.trim() === "") {
                    $('#desc-overlay').html("<i>Niemand heeft nog wat over " + thing.title + " geschreven</i>");
                } else {
                    $('#desc-overlay').text(description);
                }
                $('#desc-overlay-subject').text(thing.title);
                $('#desc-overlay-container').show();
                var desc = $('#desc-container');
                if(this.hasActiveSelection()) {
                    desc.hide();
                }
            };
            Tab.prototype.initDesc = function () {
                var _this = this;
                var form = $('#desc-form');
                form.unbind();
                form.submit(function (ev) {
                    var thing = _this.currentOpinion.thing;
                    thing.description = $('#desc').val();
                    var req = thing.updateDescription();
                    req.done(function () {
                        return _this.flash('#desc-message');
                    });
                    Client.alertOnFail(req);
                    return false;
                });
            };
            return Tab;
        })();
        Client.Tab = Tab;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
