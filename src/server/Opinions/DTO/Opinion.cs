
using System;
using System.Linq;
using ServiceStack.ServiceHost;
using ServiceStack.DataAnnotations;

namespace Sioux.TechRadar
{
    [Route("/api/opinions/{name}", "POST")] // update
    [Route("/api/opinions", "PUT")] // create    
    public class Opinion : IReturn<Opinion>
    {
        [PrimaryKey]
        [AutoIncrement]
        public int Id { get; set; }
        public Thing thing { get; set; }
        public int goodness { get; set; }
    }
}
