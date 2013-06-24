/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="auth.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />
 
module TechRadar.Client {

  declare var d3: any;



  function getThings() {
    console.log("getting things");
    var things = [];
    var d = $.Deferred();
    $.getJSON("/api/things/search/")
      .done(function(data) {
          for (var i=0;i<data.length;i++)
          {
              var quadrant = data[i].Quadrantid.toString();
              var quadrantid;
              if (quadrant == "Techniques") quadrantid = 0;
              else if (quadrant == "Tools") quadrantid = 1;
              else if (quadrant == "Languages") quadrantid = 2;
              else if (quadrant == "Platforms") quadrantid = 3;

              things.push(new Opinion(data[i].Name, data[i].Title, data[i].Description, quadrantid, random(0.1, 1.0)));			  
          }//end for
          d.resolve(things);
      }).fail(d.reject);

    return d.promise();
  }


  function getThingsAndOpinions() {
    console.log("getting things and opinions");
    var d = $.Deferred();  	
    getThings().done(function (things) {
        console.log("getting opinions");
        $.getJSON("/api/opinions")
            .done(function (data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < things.length; j++) {
                    if (data[i].thingName == things[j].name) {
                        console.log(things[j].name + " has an opinion!");
                        things[j].setgoodness(data[i].goodness);
                        things[j].rant = data[i].rant;
                        things[j].hasOpinion = true;
                    }
                }
            }//end fors		  			  	
            console.log("got opinions and  things");
            d.resolve(things);
            }).fail(d.reject);
        }).fail(d.reject);
    return d.promise();
    }

  function showTab(q: string) {

      console.log("showTab : " + q);
    // remove earlier radars, if any.
    $('svg.radar').remove();
    $('#thingsList').remove();

    var quad = (q === "all") ? null : Quadrants[parseInt(q, 10)];
    var classes = "quadrant-" + q;
    if (quad !== null) {
      classes += " single-quadrant";
    }
    var radar = new Radar(500, quad, (quad !== null), classes);
    if (AuthInfo.instance.isLoggedIn()) { 
    	getThingsAndOpinions().done(function (things) {
    		console.log("got my things =" + JSON.stringify(things));
    		if (quad !== null) {
    			showList(things, quad, radar);
    		} else {
    			showAllThings(things, radar);
    		}
    	});
    }
  }



  function addThing(thingname: string, quadrantnum: number) {
        var newThing = new Opinion(null,thingname, thingname+" has no description", quadrantnum,  random(0.1, 1.0));

        var dataforjson = JSON.stringify({ "Title": newThing.title, "Description": newThing.description, "Quadrantid": quadrantnum });

        return $.ajax({
            url: "/api/things/",
            type: 'POST',
            contentType: 'application/json',
            data: dataforjson,
            dataType: 'json'
        });
  }
    
  function addOpinion(thingname: string, things: Opinion[], radar: Radar){
    var things_matched = things.filter(t => t.name == thingname);
    if (things_matched.length != 1) {
            alert("Amount of things matched to button unexpected : " + things_matched.length);
          }
    if (thingname.length > 0) {
        //do UI stuff
        radar.addOpinion(things_matched[0]);
    }
    if (things_matched[0].hasOpinion) {
        return things_matched[0].updateOpinion()
    } else {
        things_matched[0].hasOpinion = true;
        return things_matched[0].storeNewOpinion();
    }        
  }

  function removeOpinion(thingname: string, things: Opinion[], radar: Radar){
    var things_matched = things.filter(t => t.name == thingname);
    if (things_matched.length != 1) {
            alert("Amount of things matched to button unexpected : " + things_matched.length);
          }
    if (thingname.length > 0) {
        radar.removeOpinion(things_matched[0]);
    }
    things_matched[0].hasOpinion = false;
    return things_matched[0].deleteOpinion();
  }

  function showAllThings(things: Opinion[], radar: Radar) {
  	things.forEach(thing => {
  		if (thing.hasOpinion) {
  			addOpinion(thing.name, things, radar);
  		}
  	});
  }

  function showList(things: Opinion[], quadrant: Quadrant, radar: Radar) {  	
    var parentContainer = $('<div id="thingsList" class="thing-list-left btn-group btn-group-vertical">');
    var container = $('<div class=" btn-group  btn-group-vertical" data-toggle="buttons-checkbox">');
    var selectedThings = things.filter(t => t.quadrant() === quadrant);
    selectedThings.forEach(thing => {
        if (thing.hasOpinion) {
            container.append('<button class="btn active btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
            addOpinion(thing.name, things, radar);
        } else {
            container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
        }      
    });

    // add existing things to view
    container.find('.thingButton').click(function(ev) {
        var thingname = $(this).data('thing'); 

        if (!$(this).hasClass('active')) {
            
            addOpinion(thingname, things, radar);
        }
        else {
            removeOpinion(thingname, things, radar);
        }
    });

    //add existing opinions to view


    //Section for adding a thing.       
    var btnAdd = $('<button class="btn btn_thing btn-info"  data-toggle="modal" data-target="#addThingsModal">Add</button>');
    parentContainer.append(btnAdd);
    
    $('#addthingsform').unbind('submit');
    $('#addthingsform').submit((ev) => {
        addThing($('input#titleInput').val(), quadrant.id).done(function (thing) {
            container.append('<button class="btn btn_thing thingButton" data-thing="' + thing.name + '">' + thing.title + '</button>')
            showTab(quadrant.id.toString());
            $('#addSuccess').text($('input#titleInput').val() + " has been added.");
            $('#addSuccess').show();
        });
        ev.preventDefault();
    });

    parentContainer.append(container);
    $('body').append(parentContainer);
  }

  function makeTabs() {
    $('a[data-toggle="tab"]').on('shown', e => showTab($(e.target).data('q')));
  }

  
  export function Start() {
  	makeTabs();
  	
  	AuthInfo.instance.registerCallback(function () { showTab($('li.active a[data-toggle="tab"]').data('q')); });
  	showTab($('li.active a[data-toggle="tab"]').data('q'));
    return this;
  }
}

