/// <reference path="techradar.ts" />
/// <reference path="ext/require.ts" />
this.require([
    'ext/bootstrap.min', 
    'ext/d3.v2.min'
], function () {
    require([
        'techradar'
    ], function (TechRadar) {
        var startedApp = TechRadar.Client.TechRadar.Start();
    });
});
