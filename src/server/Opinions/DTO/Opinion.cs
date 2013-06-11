
using System;
using System.Linq;
using ServiceStack.ServiceHost;
using ServiceStack.DataAnnotations;

namespace Sioux.TechRadar{

    [Route("/api/opinions/{thingName}", "GET")] // read
    [Route("/api/opinions/{thingName}", "POST")] // update
    [Route("/api/opinions", "PUT")] // create  
    [Route("/api/opinions/{thingName}", "DELETE")]
    public class Opinion : IReturn<Opinion>
    {
        public String thingName{ get; set; }
        public Double goodness { get; set; }
    }
}
