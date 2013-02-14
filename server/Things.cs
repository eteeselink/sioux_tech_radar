using System;
using System.Collections.Generic;
using ServiceStack.ServiceHost;

namespace Sioux.TechRadar
{
	[Route("/things")]
	[Route("/things/{names}")]
	public class Things : IReturn<List<Thing>>
	{
		public string[] Names{ get; private set; }
		public Things (params string[] names)
		{
			this.Names = names;
		}
	}
}

