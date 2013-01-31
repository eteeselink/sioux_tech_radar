/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

import RadarModule = module('radar')
import ViewModel = module('view-model')

export module TechRadar {

  var Quadrant = ViewModel.Quadrant;
  var Thing = ViewModel.Thing;
  var Radar = RadarModule.Radar;

  declare var d3: any;

  var quadrants = [Quadrant.Techniques, Quadrant.Tools, Quadrant.Languages, Quadrant.Platforms];



  function getThings() {
    var things = [
      new Thing("C++", Quadrant.Languages, 0.9),
      new Thing("Scala", Quadrant.Languages, 0.6),
      new Thing("TypeScript", Quadrant.Languages, 0.7),
      new Thing("C#", Quadrant.Languages, 0.1),
      new Thing("APL", Quadrant.Languages, 0.8),
      new Thing("Continuous Integration", Quadrant.Techniques, 0.8),
      new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5),
      new Thing("NCrunch", Quadrant.Tools, 0.5),
      new Thing("Git", Quadrant.Tools, 0.6),
    ];

    d3.range(60).forEach(function (i) { things.push(new Thing(i.toString(), quadrants[i % 4], RadarModule.random(0.1, 1.0))) });

    return things;
  }

  function showTab(q: string) {

    // remove earlier radars, if any.
    $('svg.radar').remove();
    $('div.thing-list').remove();

    var quad = (q === "all") ? null : quadrants[parseInt(q, 10)];
    var classes = "quadrant-" + q;
    if (quad !== null) {
      classes += " single-quadrant";
    }
    var radar = new Radar(500, quad, (quad !== null), classes);

    var things = getThings();
    radar.addThings(things);

    if (quad !== null) {
      showList(things, quad, radar);
    }
  }

  function showList(things: ViewModel.Thing[], quadrant: ViewModel.Quadrant, radar: RadarModule.Radar) {
    var contClass = quadrant.isLeft() ? "thing-list-left" : "thing-list-right";
    var container = $('<div class="btn-group btn-group-vertical thing-list '+contClass+'" data-toggle="buttons-checkbox">');
    var selectedThings = things.filter(t => t.quadrant === quadrant);
    selectedThings.forEach(thing => {
      container.append('<button class="btn" data-thing="' + thing.name + '">' + thing.name + '</button>')
    });

    container.find('.btn').click(function(ev) {

      var thing = things.filter(t => t.name == $(this).data('thing'));
      if (!$(this).hasClass('active')) {
        radar.addThings(thing);
      } else {
        //radar.removeThings(thing.map(t => t.name));
      }
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

