using System;
using NUnit.Framework;
using RestSharp;
using System.Net;


namespace Sioux.TechRadar
{
	[TestFixture()]
	public class ThingsTest
	{
		[Test()]
		public void TestServerConstruction ()
		{
			using (var testServer = new Server()) {
				Assert.IsNotNull(testServer.AppHost);
				Assert.AreEqual(8888,testServer.Port);
			}
		}

		[Test()]
		public void TestStartAndStop ()
		{
			using (var testServer = new Server()) {
				testServer.Start();

				var client = new RestClient("http://localhost:"+testServer.Port);
			
				var request = new RestRequest("Things/{name}", Method.GET);
				request.AddUrlSegment("name", "Mike");
				var response = client.Execute(request);
				Assert.IsNotNullOrEmpty(response.Content);
				Assert.AreEqual(HttpStatusCode.OK ,response.StatusCode);

				testServer.Stop();

				response = client.Execute(request);
				Assert.IsNullOrEmpty(response.Content);
			}
		}

	}
}

