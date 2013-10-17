/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="thing-list.ts" />
/// <reference path="tab.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar.Client {

    declare var d3: any;

    export function showAlert(text: string, type = "warning", timeout = 5000) {
        $('#alert-text').html(text);

        $('.alert')
            .removeClass('alert-error alert-warning alert-info alert-success')
            .addClass('alert-' + type)
            .show();

        setTimeout(() => $(".alert button.close").click(), timeout);
    }

    export function alertOnFail(request: JQueryXHR) {
        request.fail(function (xhr: JQueryXHR, textStatus: string, errorThrown: string) {
            showAlert("Server said: " + errorThrown);
        });
    }

    /// Find the thing named `thingname` in `things`. Returns `null` if none found.
    export function findThing(thingname: string, things: Thing[]) {
        var things_matched = things.filter(t => t.name == thingname);
        if (things_matched.length != 1) {
            return null;
        }
        return things_matched[0];
    }


    function getThings(searchQuad: Quadrant) {

        var url = "/api/things/search";
        if (searchQuad != null) {
            url += "?Quadrant=" + searchQuad.id;
        }

        var d = $.Deferred();
        $.getJSON(url)
          .done(function (data) {
              var things = [];
              for (var i = 0; i < data.length; i++) {
                  var quadrant = data[i].Quadrantid.toString();
                  var quadrantid;
                  if (quadrant == "Techniques") quadrantid = 0;
                  else if (quadrant == "Tools") quadrantid = 1;
                  else if (quadrant == "Languages") quadrantid = 2;
                  else if (quadrant == "Platforms") quadrantid = 3;

                  things.push(new Thing(data[i].Name, data[i].Title, data[i].Description, quadrantid));			  // , random(0.1, 1.0)
              }//end for
              d.resolve(things);
          }).fail(d.reject);

        return d.promise();
    }

    /// Get all things and all opinions for the current user.
    /// Returns a promise. The data given to a done() call is an
    /// object of the form {opinions: Opinion[], things: Thing[]}.
    export function getThingsAndOpinions(searchQuad: Quadrant) {
        var d = $.Deferred();
        getThings(searchQuad).done(function (things) {
            $.getJSON("/api/opinions/" + AuthInfo.instance.userid + "/")
                .done(function (data) {
                    var opinions: Opinion[] = [];

                    // go through all opinion data elements, and find the thing that has the same name.
                    for (var i = 0; i < data.length; i++) {

                        var thing = findThing(data[i].thingName, things);

                        if (thing != null) {
                            var opinion = new Opinion(thing, data[i].goodness, data[i].rant);
                            opinion.existsOnServer = true;
                            opinions.push(opinion);
                        }
                    }

                    d.resolve({ things: things, opinions: opinions });
                }).fail(d.reject);
        }).fail(d.reject);

        return d.promise();
    }







    function buildRantList(opinions: Opinion[]) {
        $('#rantList').remove();
        $('#contents').append('<div class="rants-list-right" id="rantList"></div>');
        $('#rantList').append('<p>click to add rant</p>');
        opinions.forEach(opinion => {
            $('#rantList').append(newRantForAccordion(opinion));
        });
        $('#rantList').show();
    }

    function newRantForAccordion(opinion: Opinion) {
        var thing = opinion.thing;
        console.log("adding rant for " + thing.name);
        var aGroup = $('<div class="accordion-group">');
        var ahead = $('<div class="accordion-heading">');
        ahead.append('<a class="accordion-toggle" data-toggle="collapse" data-parent="#rantList" href="#collapse' + thing.name + '">' + thing.title + '</a>');
        aGroup.append(ahead);

        var aBody = $('<div id="collapse' + thing.name + '" class="accordion-body collapse">');
        var subBody = $('<div class="accordion-inner">');
        aBody.append(subBody);
        var inputRant = $('<textarea id = "input' + thing.name + '" > ' + opinion.rant + ' </textarea>');
        subBody.append(inputRant);
        aGroup.append(aBody);

        var handler = function () {
            opinion.rant = inputRant.val();
            console.log("updating rant: " + opinion.rant);
            opinion.updateOpinion();
        };

        inputRant.change(handler);

        return aGroup;
    }


    function makeTabs() {
        $('a[data-toggle="tab"]').on('shown', e => Tab.show($(e.target).data('q')));
    }

    function findSharedUrlUserId() {
        var userId = location.pathname.substr(location.pathname.length - 8);
        if (userId.match(/^[a-zA-Z0-9_-]{8}$/)) {
            return userId;
        }
        return null;
    }

    function startPrivateMode() {
        $('.navbar .private').show();
        $("body").addClass("private");
        makeTabs();

        AuthInfo.init((isLogged: bool) => {
            Tab.show($('li.active a[data-toggle="tab"]').data('q'));
            var linkUrl = location.protocol + "//" + location.host + "/" + AuthInfo.instance.userid;
            $('#share-link-url').val(linkUrl);

            if (isLogged) {
                $("body").addClass("logged-in");
            }
            else {
                $("body").removeClass("logged-in");
            }
        });
    }

    function startPublicMode(userId: string) {
        $("body").addClass("public");
        AuthInfo.init(() => {
            $('.navbar .public').show();
            $('#public-username').text(AuthInfo.instance.username);
            Tab.show('all');
        }, userId);
    }

    export function Start() {
        $('.alert button.close').click(ev => $(ev.target).parent().hide(600));

        var userId = findSharedUrlUserId();
        if (userId === null) {
            startPrivateMode();
        }
        else {
            startPublicMode(userId);
        }

        return this;
    }
}

