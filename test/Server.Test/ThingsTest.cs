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
		public void TestBasicRequest ()
		{
			Thing mike = null;
			using (var fakeServer = new FakeServer( (repos)=>{mike = repos.SetupMike();}).Start()) {

				var client = new RestClient (FakeServer.BaseUri);
				var request = new RestRequest ("things/{name}", Method.GET);
				request.AddUrlSegment ("name", mike.Name);
				var response = client.Execute (request);

				Assert.IsNotNullOrEmpty (response.Content);
				Assert.AreEqual (HttpStatusCode.OK, response.StatusCode);
			}

		}

        [Test()]
        public void TestBasicRequestJson()
        {
            FakeServer fs = new FakeServer(repos => {}).Start();
            Thing mike = fs.fakeThingsRepos.SetupMike();
            JsonServiceClient client = new JsonServiceClient(FakeServer.BaseUri);
            ThingsRequest req = new ThingsRequest(new string[] {"Mike", "guido"});
            IEnumerable<Thing> res = client.Get(req);
            Assert.AreEqual(1, res.Count());
            Assert.That(res.First().Name, Is.EqualTo(mike.Name));
        }

	}
}

