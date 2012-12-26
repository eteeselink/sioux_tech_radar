/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="radar.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar {

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

    d3.range(60).forEach(function (i) { things.push(new Thing(i.toString(), quadrants[i % 4], random(0.1, 1.0))) });


    return things;
  }

  function showTab(q: string) {

    // remove earlier radars, if any.
    $('svg.radar').remove();

    var quad = (q == "all") ? null : quadrants[parseInt(q, 10)];
    var classes = "quadrant-" + q;
    if (quad !== null) {
      classes += " single-quadrant";
    }
    var radar = new Radar(500, quad, classes);

    var things = getThings();
    radar.addThings(things);

  }

  function makeTabs() {
    $('a[data-toggle="tab"]').on('shown', e => showTab($(e.target).data('q')));
  }

  
  $(function () {

    console.log("askjhadj");
    makeTabs();

    showTab("all");
  });

}

