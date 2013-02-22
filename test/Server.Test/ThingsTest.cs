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
            using (FakeServer fs = new FakeServer().Start())
            {
				Thing csharp = new Thing(){Name="C#"};
				fs.FakeThingsRepos.Things.AddFirst(csharp);

                JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri);
				ThingsRequest req = new ThingsRequest(){Names = new string[] { csharp.Name }};
                IEnumerable<Thing> res = client.Get(req);

                Assert.AreEqual(1, res.Count());
				Assert.That(res.First().Name, Is.EqualTo(csharp.Name));
            }
        }

        [Test()]
        public void EmptyRequest()
        {
            using (FakeServer fs = new FakeServer().Start())
            {
                JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri);
                ThingsRequest req = new ThingsRequest();
                IEnumerable<Thing> res = client.Get(req);
                Assert.AreEqual(0, res.Count());
            }
        }

	}
}

