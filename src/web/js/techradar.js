var TechRadar;
(function (TechRadar) {
    (function (Client) {
        function showAlert(text, type, timeout) {
            if (typeof type === "undefined") { type = "warning"; }
            if (typeof timeout === "undefined") { timeout = 5000; }
            $('#alert-text').html(text);
            $('.alert').removeClass('alert-error alert-warning alert-info alert-success').addClass('alert-' + type).show();
            setTimeout(function () {
                return $(".alert button.close").click();
            }, timeout);
        }
        Client.showAlert = showAlert;
        function alertOnFail(request) {
            request.fail(function (xhr, textStatus, errorThrown) {
                showAlert("Server said: " + errorThrown);
            });
        }
        Client.alertOnFail = alertOnFail;
        function findThing(thingname, things) {
            var things_matched = things.filter(function (t) {
                return t.name == thingname;
            });
            if(things_matched.length != 1) {
                return null;
            }
            return things_matched[0];
        }
        Client.findThing = findThing;
        function getThings(searchQuad) {
            var url = "/api/things/search";
            if(searchQuad != null) {
                url += "?Quadrant=" + searchQuad.id;
            }
            var d = $.Deferred();
            $.getJSON(url).done(function (data) {
                var things = [];
                for(var i = 0; i < data.length; i++) {
                    var quadrant = data[i].Quadrantid.toString();
                    var quadrantid;
                    if(quadrant == "Techniques") {
                        quadrantid = 0;
                    } else if(quadrant == "Tools") {
                        quadrantid = 1;
                    } else if(quadrant == "Languages") {
                        quadrantid = 2;
                    } else if(quadrant == "Platforms") {
                        quadrantid = 3;
                    }
                    things.push(new Client.Thing(data[i].Name, data[i].Title, data[i].Description, quadrantid));
                }
                d.resolve(things);
            }).fail(d.reject);
            return d.promise();
        }
        function getThingsAndOpinions(searchQuad) {
            var d = $.Deferred();
            getThings(searchQuad).done(function (things) {
                $.getJSON("/api/opinions/" + Client.AuthInfo.instance.userid + "/").done(function (data) {
                    var opinions = [];
                    for(var i = 0; i < data.length; i++) {
                        var thing = findThing(data[i].thingName, things);
                        if(thing != null) {
                            var opinion = new Client.Opinion(thing, data[i].goodness, data[i].rant);
                            opinion.existsOnServer = true;
                            opinions.push(opinion);
                        }
                    }
                    d.resolve({
                        things: things,
                        opinions: opinions
                    });
                }).fail(d.reject);
            }).fail(d.reject);
            return d.promise();
        }
        Client.getThingsAndOpinions = getThingsAndOpinions;
        function makeTabs() {
            $('a[data-toggle="tab"]').on('shown', function (e) {
                return Client.Tab.show($(e.target).data('q'));
            });
        }
        function findSharedUrlUserId() {
            var userId = location.pathname.substr(location.pathname.length - 8);
            if(userId.match(/^[a-zA-Z0-9_-]{8}$/)) {
                return userId;
            }
            return null;
        }
        function startPrivateMode() {
            $('.navbar .private').show();
            $("body").addClass("private");
            makeTabs();
            Client.AuthInfo.init(function (isLogged) {
                Client.Tab.show($('li.active a[data-toggle="tab"]').data('q'));
                var linkUrl = location.protocol + "//" + location.host + "/" + Client.AuthInfo.instance.userid;
                $('#share-link-url').val(linkUrl);
                if(isLogged) {
                    $("body").addClass("logged-in");
                } else {
                    $("body").removeClass("logged-in");
                }
            });
        }
        function startPublicMode(userId) {
            $("body").addClass("public");
            Client.AuthInfo.init(function () {
                $('.navbar .public').show();
                $('#public-username').text(Client.AuthInfo.instance.username);
                Client.Tab.show('all');
            }, userId);
        }
        function Start() {
            $('.alert button.close').click(function (ev) {
                return $(ev.target).parent().hide(600);
            });
            var userId = findSharedUrlUserId();
            if(userId === null) {
                startPrivateMode();
            } else {
                startPublicMode(userId);
            }
            return this;
        }
        Client.Start = Start;
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
