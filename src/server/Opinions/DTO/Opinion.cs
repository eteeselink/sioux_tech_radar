
using System;
using System.Linq;
using ServiceStack.ServiceHost;
using ServiceStack.DataAnnotations;
using ServiceStack.ServiceInterface;
using Sioux.TechRadar.Users.DTO;

namespace Sioux.TechRadar{

    [Route("/api/opinions/{user}/{thingName}", "PUT")] // update
    [Route("/api/opinions/{user}", "POST")] // create  
    public class Opinion
    {
        [PrimaryKey]
        [AutoIncrement]
        public int id { get; set; }
        public String thingName{ get; set; }        
        public Double goodness { get; set; }
        public String user { get; set; }
        public String rant { get; set; }
    }

    [Route("/api/opinions/{user}", "GET")] // create  
    [Route("/api/opinions/{user}/{thingName}", "GET")] // read
    [Route("/api/opinions/{user}/{thingName}", "DELETE")]
    public class OpinionRequest : IReturn<Opinion>
    {
        public String thingName { get; set; }
        public String user { get; set; }
    }
}
