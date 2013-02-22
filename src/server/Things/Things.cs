using System;
using System.Collections.Generic;
using ServiceStack.ServiceHost;
using NLog;

namespace Sioux.TechRadar
{
	[Route("/things")]
	[Route("/things/{names}")]
	public class Things : IReturn<List<Thing>>
	{
		public string[] Names{ get; private set; }
		private static Logger log = LogManager.GetLogger("Server");

		//the params keyword will throw scary IL generator exception on MONO for mac...:-(
		//public Things (params string[] names)
		public Things (string[] names)
		{
			this.Names = names;
			log.Debug ("constructing things with {}",names);
		}
	}
}

