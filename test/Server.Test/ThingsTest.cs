using System;
using System.Linq;
using NUnit.Framework;
using RestSharp;
using System.Net;
using Funq;
using NLog;
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
        public void TestThingRequest()
        {
            using (FakeServer fs = new FakeServer().Start())
            {
                Thing mike = new Thing("Mike");
                fs.FakeThingsRepos.Things.AddFirst(mike);
                JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri);
                ThingsRequest req = new ThingsRequest(new string[] { "Mike", "Mike", "Not Mike" });
                IEnumerable<Thing> res = client.Get(req);
                Assert.AreEqual(1, res.Count());
                Assert.That(res.First().Name, Is.EqualTo(mike.Name));
            }
        }

        [Test()]
        public void TestEmptyThingRequest()
        {
            using (FakeServer fs = new FakeServer().Start())
            {
                JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri);
                ThingsRequest req = new ThingsRequest(new string[] { });
                IEnumerable<Thing> res = client.Get(req);
                Assert.AreEqual(0, res.Count());
            }
        }

	}
}

