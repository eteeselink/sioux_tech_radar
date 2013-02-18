using System;
using NUnit.Framework;
using RestSharp;

namespace Sioux.TechRadar
{
	[TestFixture()]
	public class ThingsTest
	{
		[Test()]
		public void TestStartAndStop ()
		{
			using (var testServer = new Server()) {
				testServer.Start();

				var client = new RestClient("http://localhost:"+testServer.Port);
				// client.Authenticator = new HttpBasicAuthenticator(username, password);
			
				var request = new RestRequest("Things/{name}", Method.GET);
				request.AddUrlSegment("name", "Mike");
				var response = client.Execute(request);
				Assert.IsNotNullOrEmpty(response.Content);

				testServer.Stop();

				response = client.Execute(request);
				Assert.IsNullOrEmpty(response.Content);
			}

		}
	}
}

