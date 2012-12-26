/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />
/// <reference path="ext/jquery-1.8.d.ts" />

module TechRadar {

  $(function () {

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

    var q = [Quadrant.Languages, Quadrant.Platforms, Quadrant.Techniques, Quadrant.Tools];

    d3.range(60).forEach(function (i) { things.push(new Thing(i.toString(), q[i % 4], random(0.1, 1.0))) });

    var quad: Quadrant
    if (document.location.hash) {
      var hash = parseInt(document.location.hash.substr(1));
      quad = q[hash];
    }

    var radar = new Radar(500, quad);

    radar.addThings(things);
  });

}