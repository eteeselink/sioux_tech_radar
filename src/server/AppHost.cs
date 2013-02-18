using System;
using ServiceStack.WebHost.Endpoints;
using Funq;

namespace Sioux.TechRadar
{
	public class AppHost: AppHostHttpListenerBase
	{
		public AppHost()
		: base("Sioux TechRadar Service", typeof(Things).Assembly) {}

		public override void Configure(Container container)
		{
			container.Register<IThingsRepository>(new ThingsRepository());
		}

	}
}

