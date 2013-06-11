using System;
using NUnit.Framework;
using Funq;
using System.Linq;

namespace Sioux.TechRadar
{
    [TestFixture()]
    public class ServerTest
    {
        [Test()]
        public void TestServerConstruction()
        {
            using (var testServer = new Server())
            {
                Assert.IsNotNull(testServer.Container);
                Assert.AreEqual(8888, testServer.Port);
            }
        }

        [Test()]
        public void TestFunqEasy()
        {
            using (var container = new Container())
            {
                var fakeThings = new FakeThingsRepository();

                var mike = fakeThings.SetupFakeThing();
                container.Register<IThingsRepository>(fakeThings);

                var things = container.Resolve<IThingsRepository>().GetByName(new string[] { "C#" });
                Assert.That(things.First(), Is.EqualTo(mike));

            }
        }

        [Test()]
        public void TestFunqChildContainer()
        {
            var fakeThings = new FakeThingsRepository();

            var mike = fakeThings.SetupFakeThing();

            using (var container = new Container())
            {
                container.Register<IThingsRepository>(fakeThings);

                using (var container2 = container.CreateChildContainer())
                {
                    var things = container2.Resolve<IThingsRepository>().GetByName(new string[] { "C#" });
                    Assert.That(things.First(), Is.EqualTo(mike));
                }
            }
        }

        [Test()]
        public void TestReusingContainerFromServer()
        {
            var fakeThings = new FakeThingsRepository();


            var mike = fakeThings.SetupFakeThing();

            using (var server = new Server())
            {
                var container = server.Container;
                container.Register<IThingsRepository>(fakeThings);

                var things = container.Resolve<IThingsRepository>().GetByName(new string[] { "C#" });
                Assert.That(things.First(), Is.EqualTo(mike));

            }

        }
    }
}

