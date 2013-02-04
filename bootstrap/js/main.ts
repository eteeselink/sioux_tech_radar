/// <reference path="techradar.ts" />
/// <reference path="ext/require.ts" />


require(['ext/bootstrap.min','ext/d3.v2.min','/socket.io/socket.io.js'], () => {
    require(['techradar'],(TechRadar)=>{
        var startedApp = TechRadar.Client.TechRadar.Start();
    });
});
