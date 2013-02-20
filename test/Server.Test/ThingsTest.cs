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

		private static Logger logger = LogManager.GetLogger("ThingsTest");

		[Test()]
		public void TestServerConstruction ()
		{
			using (var testServer = new Server()) {
				Assert.IsNotNull(testServer.Container);
				Assert.AreEqual(8888,testServer.Port);
			}
		}

		[Test()]
		public void TestFunqEasy()
		{
			using(var container = new Container())
		    {
				using (var fakeThings = new FakeThingsRepository()){
					var mike = fakeThings.SetupMike();
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
				var mike = fakeThings.SetupMike();

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
		public void TestReusingContainerFromServer()
		{
			using (var fakeThings = new FakeThingsRepository()) {

				var mike = fakeThings.SetupMike();
				
				using (var server = new Server()){
					var container = server.Container;
					container.Register<IThingsRepository> (fakeThings);
						
					var things = container.Resolve<IThingsRepository>().GetByName(new string[]{"Mike"});
					Assert.That(things.First(),Is.EqualTo(mike));

					server.Start();
				}
			}
		}

		[Test()]
		public void TestBasicRequest ()
		{
			using (var fakeThings = new FakeThingsRepository()) {
				
				var mike = fakeThings.SetupMike ();

				using (var testServer = new Server()) {

					testServer.Container.Register<IThingsRepository>(fakeThings);
					testServer.Start();

					var client = new RestClient ("http://localhost:" + testServer.Port);
					var request = new RestRequest ("things/{name}", Method.GET);
					request.AddUrlSegment ("name", mike.Name);
					var response = client.Execute(request);

					Assert.IsNotNullOrEmpty (response.Content);
					Assert.AreEqual (HttpStatusCode.OK, response.StatusCode);
				}
			}
		}

	}
}

