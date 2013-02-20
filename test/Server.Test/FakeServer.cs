using System;
using ServiceStack.WebHost.Endpoints;
using Funq;

namespace Sioux.TechRadar
{
	public class FakeServer : AppHostHttpListenerBase
	{
		public const string BaseUri = "http://localhost:8000/";

		public FakeServer (Action<FakeThingsRepository> construct): base("Service Setup Tests", typeof(Things).Assembly) 
		{
			fakeThingsRepos = new FakeThingsRepository ();
			construct (fakeThingsRepos);
		}

		public FakeThingsRepository fakeThingsRepos { get; set; }

		public override void Configure(Container container)
		{
			container.Register<IThingsRepository> (fakeThingsRepos);			
		}
		public FakeServer Start()
		{
			Init ();
			Start (BaseUri);
			return this;
		}
	}
}

