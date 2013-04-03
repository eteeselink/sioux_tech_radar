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
					var newThing = new Thing(){ Name="D", Description="Not C++", Quadrant=Quadrant.Languages};
					client.Put(newThing);					
					ThingsRequest req = new ThingsRequest(){Names = new string[] { "D" }};					
					IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
					
					res.Count().ShouldBe(1);
					res.First().Description.ShouldBe(newThing.Description);
					res.First().Quadrant.ShouldBe(newThing.Quadrant);
				}
			}
		}


		[Test()]
		public void UpdateThing()
		{
			using (FakeServer fs = new FakeServer().StartWithRealRepos())
			{
				using(JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri)){
					var newThing = new Thing(){ Name="D", Description="Not C++", Quadrant=Quadrant.Languages};
					fs.RealThingsRepos.StoreNew(newThing);

					var updatedThing = new Thing(){ Name="D", Description="Not C++, but kinda the same", Quadrant=Quadrant.Languages};
					Thing result= client.Post(updatedThing);

					ThingsRequest req = new ThingsRequest(){Names = new string[] { "D" }};
					IEnumerable<Thing> res = client.Get(req.UrlEncodeNames());
					
					res.Count().ShouldBe(1);
					result.Quadrant.ShouldBe(updatedThing.Quadrant);
					result.Description.ShouldBe(updatedThing.Description);
				}
			}
		}
	}
}

