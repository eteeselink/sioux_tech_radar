using System;
using ServiceStack.WebHost.Endpoints;
using Funq;
using ServiceStack.OrmLite;

namespace Sioux.TechRadar
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Interoperability", "CA1405:ComVisibleTypeBaseTypesShouldBeComVisible")]
    public class FakeServer : AppHostHttpListenerBase
	{
		public const string BaseUri = "http://localhost:8000/";

		public FakeServer (): base("Service Setup Tests", typeof(ThingsRequest).Assembly) 
		{
			FakeThingsRepos = new FakeThingsRepository ();
 			RealThingsRepos = new ThingsRepository(){ 
				//ConnectionFactory = new SqLiteInMemoryFactory ()
				ConnectionFactory = new TempSQLiteFactory()
			}.EnsureTablesExist();
		}

		public FakeThingsRepository FakeThingsRepos { get; set; }
		public ThingsRepository RealThingsRepos {get; set; }
		public IThingsRepository UsedThingsRepos { get; set; }

		public override void Configure(Container container)
		{
			container.Register<IThingsRepository> (UsedThingsRepos);			
		}
		public FakeServer StartWithFakeRepos()
		{
			UsedThingsRepos = FakeThingsRepos;
			Init ();
			Start (BaseUri);
			return this;
		}

		public FakeServer StartWithRealRepos()
		{
			UsedThingsRepos = RealThingsRepos;
			Init ();
			Start (BaseUri);
			return this;
		}
	}
}

