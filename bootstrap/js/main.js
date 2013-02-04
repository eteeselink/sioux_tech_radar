this.require([
    'ext/bootstrap.min', 
    'ext/d3.v2.min', 
    '/socket.io/socket.io.js'
], function () {
    require([
        'techradar'
    ], function (TechRadar) {
        var startedApp = TechRadar.Client.TechRadar.Start();
    });
});
