﻿
using System;
using System.Linq;
using ServiceStack.ServiceHost;
using ServiceStack.DataAnnotations;
using ServiceStack.ServiceInterface;
using Sioux.TechRadar.Users.DTO;

namespace Sioux.TechRadar{

    [Route("/api/opinions", "GET")] // create  
    [Route("/api/opinions/{thingName}", "GET")] // read
    [Route("/api/opinions/{thingName}", "PUT")] // update
    [Route("/api/opinions", "POST")] // create  
    [Route("/api/opinions/{thingName}", "DELETE")]
    [Authenticate]
    public class Opinion : IReturn<Opinion>
    {
        public String thingName{ get; set; }        
        public Double goodness { get; set; }
        public String user { get; set; }
    }
}
