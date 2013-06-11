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

    $.ajaxSetup({
        async: false
    });

    $.getJSON("http://localhost:54321/api/things/search/")
      .done(function(data) {
          for (var i=0;i<data.length;i++)
          {
              //TODO : quadrant and goodness - Why data[i].quadrant doesn't work ?
//                things.push(new Thing(data[i].Title, data[i].quadrant.toNumber(), random(0.1, 1.0))) ;
              things.push(new Thing(data[i].Title, quadrants[i % 4], random(0.1, 1.0))) ;
          }
    });

    $.ajaxSetup({
        async: true
    });

    //d3.range(5).forEach(function (i) { things.push(new Thing(i.toString(), quadrants[i % 4], 
    //  random(0.1, 1.0))) });

    return things;
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

    if (quad !== null) {
        showList(getThings(), quad, radar);
    }
  }

  function addThing(thingname: string, quadrant: Quadrant) {
        var newThing = new Thing(thingname, quadrant, random(0.1, 1.0));

        $.ajax({
            url: "http://localhost:54321/api/things/",
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(newThing),
            dataType: 'json'
        }).done(function (data) { console.log("ajax (addThing) OK")});
  }
    
  function addOpinion(thingname: string, things: Thing[], radar: Radar){
    var things_matched = things.filter(t => t.name == thingname);
    if (things_matched.length != 1) {
            alert("Amount of things matched to button unexpected : " + things_matched.length);
          }
    if (thingname.length > 0) {
        radar.addOpinion(things_matched[0]);
    }
      console.log("added opinion : " + things_matched[0].name + ", goodness: " + things_matched[0].goodness 
          + ", quadrant:  " + things_matched[0].quadrant)
  }

  function removeOpinion(thingname: string, things: Thing[], radar: Radar){
    var things_matched = things.filter(t => t.name == thingname);
    if (things_matched.length != 1) {
            alert("Amount of things matched to button unexpected : " + things_matched.length);
          }
    if (thingname.length > 0) {
        radar.removeOpinion(things_matched[0]);
    }
  }


  function showList(things: Thing[], quadrant: Quadrant, radar: Radar) {
    var contClass = quadrant.isLeft() ? "thing-list-left" : "thing-list-right";
    var container = $('<div class="btn-group btn-group-vertical thing-list '+contClass+'" data-toggle="buttons-checkbox">');
    var selectedThings = things.filter(t => t.quadrant === quadrant);
    selectedThings.forEach(thing => {
      container.append('<button class="btn" data-thing="' + thing.name + '">' + thing.name + '</button>')
    });

    container.find('.btn').click(function(ev) {
        var thingname = $(this).data('thing'); 
        //thingname.concat($(this).data('thing'));


        console.log($(this).data('thing'));
        console.log("button pressed, name = " + thingname);

        if (!$(this).hasClass('active')) {
            addOpinion(thingname, things, radar);
            //if (thingname.length > 0) {

            //    radar.addOppinion(thingname, things);    
        }
        else {
              removeOpinion(thingname, things, radar);
        }
        console.log("processed (added or removed opinion) : " + thingname);
    });


    //Section for adding a thing.
    container.append('<button class="addbtn">' + 'ADD' + '</button>');
    container.append('title: <input type="text" id="title">');

    container.find('.addbtn').click(function (ev) {
        addThing($("#title").val(), quadrant);
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

