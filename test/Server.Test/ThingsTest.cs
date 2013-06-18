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
    public class ThingsTest
    {

        //private static Logger logger = LogManager.GetLogger ("ThingsTest");


        [Test()]
        public void SingleRequesByNametWithSingleAnswer()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                Thing csharp = new Thing(){Name="c#"};
                fs.FakeThingsRepos.Things.AddFirst(csharp);

                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    ThingsRequest req = new ThingsRequest() { Names = new string[] { "VBS?", "Yes", csharp.Name } };
                    IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());

                    Assert.AreEqual(1, res.Count());
                    Assert.That(res.First().Name, Is.EqualTo(csharp.Name));
                }
            }
        }

        [Test()]
        public void MultipleItemsInRequest()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                var things = fs.FakeThingsRepos.Things;
                things.AddFirst(new Thing(){Name="c#"});
                things.AddFirst(new Thing(){Name="mono"});
                things.AddFirst(new Thing(){Name="c++"});
                
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    ThingsRequest req = new ThingsRequest(){Names = new string[] { "C#","mono" , "c++" }}; // notice that C# should be c#
                    IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
                    
                    Assert.AreEqual(2, res.Count());					
                }
            }
        }

        [Test()]
        public void SelectyByQuadrant()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                var things = fs.FakeThingsRepos.Things;
                things.AddFirst(new Thing(){Name="c#", Quadrantid=Quadrant.Languages});
                things.AddFirst(new Thing(){Name="mono", Quadrantid=Quadrant.Platforms});
                things.AddFirst(new Thing(){Name="c++", Quadrantid =Quadrant.Languages});
                
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    ThingsRequest req = new ThingsRequest(){Quadrant = Quadrant.Languages};
                    IEnumerable<Thing> res = client.Get(req);
                    
                    Assert.AreEqual(2, res.Count());					
                }
            }
        }

        [Test()]
        public void SelectByKeywordSearch()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                var things = fs.FakeThingsRepos.Things;
                things.AddFirst(new Thing(){Name="c#", Quadrantid=Quadrant.Languages, Description="a Java like language from Microsoft" });
                things.AddFirst(new Thing(){Name="mono", Quadrantid=Quadrant.Platforms, Description="an application platform by Microsoft"});
                things.AddFirst(new Thing(){Name="c++", Quadrantid =Quadrant.Languages, Description="an ancient language"});
                
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    ThingsRequest req = new ThingsRequest(){Keywords = new string[]{"microsoft"}};
                    IEnumerable<Thing> res = client.Get(req);
                    
                    Assert.AreEqual(2, res.Count());					
                }
            }
        }

        [Test()]
        public void SelectByKeywordSearchAndQuadrant()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                var things = fs.FakeThingsRepos.Things;
                things.AddFirst(new Thing(){Name="c#", Quadrantid=Quadrant.Languages, Description="a Java like language from Microsoft" });
                things.AddFirst(new Thing(){Name="mono", Quadrantid=Quadrant.Platforms, Description="an application platform by Microsoft"});
                things.AddFirst(new Thing(){Name="c++", Quadrantid =Quadrant.Languages, Description="an ancient language"});
                
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    ThingsRequest req = new ThingsRequest(){Keywords = new string[]{"microsoft"}, Quadrant = Quadrant.Languages};
                    IEnumerable<Thing> res = client.Get(req);
                    
                    Assert.AreEqual(1, res.Count());					
                }
            }
        }

        [Test()]
        public void EmptyRequest()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    ThingsRequest req = new ThingsRequest();
                    var res = client.Get(req);
                    Assert.AreEqual(0, res.Count());	
                }
            }
        }

        [Test()]
        [ExpectedException(typeof(WebServiceException))]
        public void AddEmptyThing()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing();
                    client.Post(newThing);
                }
            }
        }

        [Test()]
        public void AddNewThing()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="D", Title="D", Description="Not C++", Quadrantid=Quadrant.Languages};
                    var existingThing = client.Post(newThing);
                    existingThing.Name.ShouldBe("d");

                    ThingsRequest req = new ThingsRequest(){ Names = new string[] { "d" }};
                    IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());

                    res.Count().ShouldBe(1);
                    res.First().Name.ShouldBe("d");
                }
            }
        }

        [Test()]
        [ExpectedException(typeof(WebServiceException))]
        public void UpdateNonExistingThing ()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="d", Description="Not C++", Quadrantid=Quadrant.Languages};
                    
                    client.Put(newThing);
                }
            }
        }

        [Test()]
        [ExpectedException(typeof(WebServiceException))]
        public void CreateExistingThing()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="d", Description="Not C++", Quadrantid=Quadrant.Languages};

                    fs.FakeThingsRepos.Things.AddLast(newThing);
                    
                     client.Post(newThing);
                }
            }
        }



        [Test()]
        public void UpdateThingDescription()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="d", Description="Not C++", Quadrantid=Quadrant.Languages};

                    fs.FakeThingsRepos.Things.AddLast(newThing);
                    var updatedThing = new Thing(){ Name="d", Description="Not C++, but kinda the same", Quadrantid=Quadrant.Languages};

                    Thing result= client.Put(updatedThing);

                    ThingsRequest req = new ThingsRequest(){Names = new string[] { "d" }};
                    IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
                    
                    Assert.AreEqual(1, res.Count());
                    Assert.That(result.Quadrantid, Is.EqualTo(updatedThing.Quadrantid));
                    Assert.That(result.Description, Is.EqualTo(updatedThing.Description));
                }
            }
        }

        [Test()]
        [ExpectedException(typeof(WebServiceException))]
        public void UpdateOfTitleShouldFail()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="f#net", Title="F# .NET", Description="something functional", Quadrantid=Quadrant.Languages};
                    
                    fs.FakeThingsRepos.Things.AddLast(newThing);
                    var updatedThing = new Thing(){ Name="f#net", Title="F#", Description="something functional", Quadrantid=Quadrant.Languages};
                    
                    Thing result= client.Post(updatedThing);
                }
            }
        }

        [Test()]
        [ExpectedException(typeof(WebServiceException))]
        public void UpdateOfNameShouldFail()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="f#net", Title="F# .NET", Description="something functional", Quadrantid=Quadrant.Languages};
                    
                    fs.FakeThingsRepos.Things.AddLast(newThing);
                    var updatedThing = new Thing(){ Name="f#", Title="F# .NET", Description="something functional", Quadrantid=Quadrant.Languages};
                    
                    Thing result= client.Put(updatedThing);
                }
            }
        }

        [Test()]
        [ExpectedException(typeof(WebServiceException))]
        public void UpdateOfQuadrantShouldFail()
        {
            using (FakeServer fs = new FakeServer().StartWithFakeRepos())
            {
                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
                    var newThing = new Thing(){ Name="f#net", Title="F# .NET", Description="something functional", Quadrantid=Quadrant.Languages};
                    
                    fs.FakeThingsRepos.Things.AddLast(newThing);
                    var updatedThing = new Thing(){ Name="f#net", Title="F# .NET", Description="something functional", Quadrantid=Quadrant.Platforms};
                    
                    Thing result= client.Post(updatedThing);
                }
            }
        }
    }
}

