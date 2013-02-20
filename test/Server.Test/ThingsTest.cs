using System;
using System.Linq;
using NUnit.Framework;
using RestSharp;
using System.Net;
using Funq;
using NLog;

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

	}
}

