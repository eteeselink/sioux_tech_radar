using System;
using ServiceStack.WebHost.Endpoints;
using Funq;
using ServiceStack.OrmLite;

namespace Sioux.TechRadar
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Interoperability", "CA1405:ComVisibleTypeBaseTypesShouldBeComVisible")]
    public class FakeServer : AppHostHttpListenerBase
    {
        /// <summary>
        /// Base URI of the server. We use the machine name instead of "localhost" so that e.g. Fiddler2 can read the communication.
        /// </summary>
        public static readonly string BaseUri = String.Format("http://{0}:8000/", Environment.MachineName);

        public FakeServer (): base("Service Setup Tests", typeof(ThingsRequest).Assembly) 
        {
            FakeThingsRepos = new FakeThingsRepository ();
            RealThingsRepos = new ThingsRepository(new TempSQLiteFactory());
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

