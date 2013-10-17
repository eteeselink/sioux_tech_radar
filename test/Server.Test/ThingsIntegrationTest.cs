using System;
using System.Linq;
using NUnit.Framework;
using System.Net;
using Funq;
using ServiceStack.ServiceClient.Web;
using ServiceStack.ServiceHost;
using System.Collections.Generic;
using Shouldly;

namespace Sioux.TechRadar
{
    [TestFixture()]
    public class ThingsIntegrationTest
    {

        //private static Logger logger = LogManager.GetLogger ("ThingsTest");

       

        [Test()]
        public void AddNewThing()
        {
            using (FakeServer fs = new FakeServer().StartWithRealRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Title="D", Description="Not C++", Quadrantid=Quadrant.Languages};
                    client.Post(newThing);					
                    ThingsRequest req = new ThingsRequest(){Names = new string[] { "d" }};					
                    IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
                    
                    res.Count().ShouldBe(1);
                    res.First().Description.ShouldBe(newThing.Description);
                    res.First().Quadrantid.ShouldBe(newThing.Quadrantid);
                }
            }
        }



        [Test()]
        public void UpdateThing()
        {
            using (FakeServer fs = new FakeServer().StartWithRealRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="d", Title="D", Description="Not C++", Quadrantid=Quadrant.Languages};
                    newThing = fs.RealThingsRepos.StoreNew(newThing);

                    var updatedThing = new Thing() { Name = "d", Description = ", whatever" };
                    client.Put(updatedThing);

                    ThingsRequest req = new ThingsRequest(){Names = new string[] { "d" }};
                    IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
                    
                    res.Count().ShouldBe(1);
                    Thing result = res.Single();
                    result.Quadrantid.ShouldBe(newThing.Quadrantid);
                    result.Description.ShouldBe(updatedThing.Description);
                }
            }
        }
    }
}

