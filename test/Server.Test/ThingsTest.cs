using System;
using System.Linq;
using NUnit.Framework;
using RestSharp;
using System.Net;
using Funq;


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
		public void TestFunqEasy()
		{
			using(var container = new Container())
		    {
				using (var fakeThings = new FakeThingsRepository()){
					var mike = new Thing(){Name="Mike"};
					fakeThings.Things.AddFirst(mike);
					container.Register<IThingsRepository>(fakeThings);

					var things = container.Resolve<IThingsRepository>().GetByName(new string[]{"Mike"});
					Assert.That(things.First(),Is.EqualTo(mike));
				}
			}
		}

		[Test()]
		public void TestFunqChildContainer()
		{
			using (var fakeThings = new FakeThingsRepository()){
				var mike = new Thing(){Name="Mike"};
				fakeThings.Things.AddFirst(mike);

				using(var container = new Container())
				{
					container.Register<IThingsRepository>(fakeThings);

					using (var container2 = container.CreateChildContainer())
					{
						var things = container2.Resolve<IThingsRepository>().GetByName(new string[]{"Mike"});
						Assert.That(things.First(),Is.EqualTo(mike));
					}
				}
			}
		}

		[Test()]
		public void TestBasicRequest ()
		{
			using (var testServer = new Server()) {
				testServer.Start();

				var client = new RestClient("http://localhost:"+testServer.Port);
				var request = new RestRequest("things/{name}", Method.GET);
				request.AddUrlSegment("name", "Mike");
				var response = client.Execute(request);

				Assert.IsNotNullOrEmpty(response.Content);
				Assert.AreEqual(HttpStatusCode.OK ,response.StatusCode);
			}
	
		}

	}
}

