/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />
 
module TechRadar.Client {

  declare var d3: any;

  var quadrants = [Quadrant.Techniques, Quadrant.Tools, Quadrant.Languages, Quadrant.Platforms];


  function getThings() {
      
    //TODO : thingsinfocus as class variables ? Also quadrant ?

    var things = [];
    var d = $.Deferred();
    $.getJSON("http://localhost:54321/api/things/search/")
      .done(function(data) {
          for (var i=0;i<data.length;i++)
          {
              var quadrant = data[i].Quadrantid.toString();
              var quadrantid;
              if (quadrant == "Techniques") quadrantid = 0;
              else if (quadrant == "Tools") quadrantid = 1;
              else if (quadrant == "Languages") quadrantid = 2;
              else if (quadrant == "Platforms") quadrantid = 3;

              things.push(new Thing(data[i].Title, quadrantid, quadrants[quadrantid], random(0.1, 1.0)));			  
          }//end for
          d.resolve(things);
      }).fail(d.reject);

    return d.promise();
  }

  

  function showTab(q: string) {

      console.log("showTab : " + q);
    // remove earlier radars, if any.
    $('svg.radar').remove();
    $('div.thing-list').remove();

    var quad = (q === "all") ? null : quadrants[parseInt(q, 10)];
    var classes = "quadrant-" + q;
    if (quad !== null) {
      classes += " single-quadrant";
    }
    var radar = new Radar(500, quad, (quad !== null), classes);
    var things = getThings().done(function (things) {
    	if (quad !== null) {
    		showList(things, parseInt(q, 10), quad, radar);
    	}
    });
  }




  function addThing(thingname: string, quadrantnum: number, quadrant: Quadrant) {
        var newThing = new Thing(thingname, quadrantnum,  quadrant, random(0.1, 1.0));

        var dataforjson = JSON.stringify(newThing);
        console.log("dataforjson : ");
        console.log(dataforjson);

        return $.ajax({
        	url: "http://localhost:54321/api/things/",
        	type: 'POST',
        	contentType: 'application/json',
        	data: JSON.stringify(newThing),
        	dataType: 'json'
        });
  }
    
  function addOpinion(thingname: string, things: Thing[], radar: Radar){
    var things_matched = things.filter(t => t.name == thingname);
    if (things_matched.length != 1) {
            alert("Amount of things matched to button unexpected : " + things_matched.length);
          }
    if (thingname.length > 0) {
        radar.addOpinion(things_matched[0]);
    }
    return things_matched[0].storeNewOpinion();
  }

  function removeOpinion(thingname: string, things: Thing[], radar: Radar){
    var things_matched = things.filter(t => t.name == thingname);
    if (things_matched.length != 1) {
            alert("Amount of things matched to button unexpected : " + things_matched.length);
          }
    if (thingname.length > 0) {
        radar.removeOpinion(things_matched[0]);
    }
    return things_matched[0].deleteOpinion();
  }


  function showList(things: Thing[], quadrantnum: number, quadrant: Quadrant, radar: Radar) {
    var contClass = quadrant.isLeft() ? "thing-list-left" : "thing-list-right";
    var container = $('<div class="btn-group btn-group-vertical thing-list '+contClass+'" data-toggle="buttons-checkbox">');
    var selectedThings = things.filter(t => t.quadrant === quadrant);
    selectedThings.forEach(thing => {
      container.append('<button class="btn" data-thing="' + thing.name + '">' + thing.name + '</button>')
    });

	// add existing things to view
    container.find('.btn').click(function(ev) {
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
    container.append('<button class="addbtn">' + 'ADD' + '</button>');
    container.append('title: <input type="text" id="title">');

    container.find('.addbtn').click(function (ev)
     {
        addThing($("#title").val(), quadrantnum, quadrant);
    });
    $('body').append(container);
  }

  function makeTabs() {
    $('a[data-toggle="tab"]').on('shown', e => showTab($(e.target).data('q')));
  }


  export function Start() {
    makeTabs();
    showTab($('li.active a[data-toggle="tab"]').data('q'));
    return this;
  }
}

