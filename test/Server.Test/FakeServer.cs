using System;
using ServiceStack.WebHost.Endpoints;
using Funq;

namespace Sioux.TechRadar
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Interoperability", "CA1405:ComVisibleTypeBaseTypesShouldBeComVisible")]
    public class FakeServer : AppHostHttpListenerBase
	{
		public const string BaseUri = "http://localhost:8000/";

		public FakeServer (): base("Service Setup Tests", typeof(ThingsRequest).Assembly) 
		{
			FakeThingsRepos = new FakeThingsRepository ();
		}

		public FakeThingsRepository FakeThingsRepos { get; set; }

		public override void Configure(Container container)
		{
			container.Register<IThingsRepository> (FakeThingsRepos);			
		}
		public FakeServer Start()
		{
			Init ();
			Start (BaseUri);
			return this;
		}

	}
}

