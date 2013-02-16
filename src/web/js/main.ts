/// <reference path="techradar.ts" />
/// <reference path="ext/require.ts" />


require(['ext/bootstrap.min','ext/d3.v2.min'], () => {
    require(['techradar'],(TechRadar)=>{
        var startedApp = TechRadar.Client.TechRadar.Start();
    });
});
