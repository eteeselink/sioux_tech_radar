using System;
using System.Linq;
using NUnit.Framework;
using System.Net;
using Funq;
using ServiceStack.ServiceClient.Web;
using ServiceStack.ServiceHost;
using System.Collections.Generic;

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
				Thing csharp = new Thing(){Name="C#"};
				fs.FakeThingsRepos.Things.AddFirst(csharp);

                using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
					ThingsRequest req = new ThingsRequest(){Names = new string[] { "VBS?"," \0" , csharp.Name }};
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
				things.AddFirst(new Thing(){Name="C#"});
				things.AddFirst(new Thing(){Name="Mono"});
				things.AddFirst(new Thing(){Name="C++"});
				
				using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
					ThingsRequest req = new ThingsRequest(){Names = new string[] { "C#","Mono" , "C++" }};
					IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
					
					Assert.AreEqual(3, res.Count());					
				}
			}
		}

		[Test()]
		public void SelectyByQuadrant()
		{
			using (FakeServer fs = new FakeServer().StartWithFakeRepos())
			{
				var things = fs.FakeThingsRepos.Things;
				things.AddFirst(new Thing(){Name="C#", Quadrant=Quadrant.Languages});
				things.AddFirst(new Thing(){Name="Mono", Quadrant=Quadrant.Platforms});
				things.AddFirst(new Thing(){Name="C++", Quadrant =Quadrant.Languages});
				
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
				things.AddFirst(new Thing(){Name="C#", Quadrant=Quadrant.Languages, Description="a Java like language from Microsoft" });
				things.AddFirst(new Thing(){Name="Mono", Quadrant=Quadrant.Platforms, Description="an application platform by Microsoft"});
				things.AddFirst(new Thing(){Name="C++", Quadrant =Quadrant.Languages, Description="an ancient language"});
				
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
				things.AddFirst(new Thing(){Name="C#", Quadrant=Quadrant.Languages, Description="a Java like language from Microsoft" });
				things.AddFirst(new Thing(){Name="Mono", Quadrant=Quadrant.Platforms, Description="an application platform by Microsoft"});
				things.AddFirst(new Thing(){Name="C++", Quadrant =Quadrant.Languages, Description="an ancient language"});
				
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
					client.Put(newThing);
				}
			}
		}

		[Test()]
		public void AddNewThing()
		{
			using (FakeServer fs = new FakeServer().StartWithFakeRepos())
			{
				using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
					var newThing = new Thing(){ Description="Not C++", Quadrant=Quadrant.Languages};
					 client.Put(newThing);

					ThingsRequest req = new ThingsRequest(){Names = new string[] { "D" }};
					IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
					
					Assert.AreEqual(1, res.Count());
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
					var newThing = new Thing(){ Name="D", Description="Not C++", Quadrant=Quadrant.Languages};
					
					client.Post(newThing);
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
					var newThing = new Thing(){ Name="D", Description="Not C++", Quadrant=Quadrant.Languages};

					fs.FakeThingsRepos.Things.AddLast(newThing);
					
					 client.Put(newThing);
				}
			}
		}



		[Test()]
		public void UpdateThingDescription()
		{
			using (FakeServer fs = new FakeServer().StartWithFakeRepos())
			{
				using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
					var newThing = new Thing(){ Name="D", Description="Not C++", Quadrant=Quadrant.Languages};

					fs.FakeThingsRepos.Things.AddLast(newThing);
					var updatedThing = new Thing(){ Name="D", Description="Not C++, but kinda the same", Quadrant=Quadrant.Languages};

					Thing result= client.Post(updatedThing);

					ThingsRequest req = new ThingsRequest(){Names = new string[] { "D" }};
					IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
					
					Assert.AreEqual(1, res.Count());
					Assert.That(result.Quadrant, Is.EqualTo(updatedThing.Quadrant));
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
					var newThing = new Thing(){ Name="F#NET", Title="F# .NET", Description="something functional", Quadrant=Quadrant.Languages};
					
					fs.FakeThingsRepos.Things.AddLast(newThing);
					var updatedThing = new Thing(){ Name="F#NET", Title="F#", Description="something functional", Quadrant=Quadrant.Languages};
					
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
					var newThing = new Thing(){ Name="F#NET", Title="F# .NET", Description="something functional", Quadrant=Quadrant.Languages};
					
					fs.FakeThingsRepos.Things.AddLast(newThing);
					var updatedThing = new Thing(){ Name="F#", Title="F# .NET", Description="something functional", Quadrant=Quadrant.Languages};
					
					Thing result= client.Post(updatedThing);
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
					var newThing = new Thing(){ Name="F#NET", Title="F# .NET", Description="something functional", Quadrant=Quadrant.Languages};
					
					fs.FakeThingsRepos.Things.AddLast(newThing);
					var updatedThing = new Thing(){ Name="F#NET", Title="F# .NET", Description="something functional", Quadrant=Quadrant.Platforms};
					
					Thing result= client.Post(updatedThing);
				}
			}
		}
	}
}

