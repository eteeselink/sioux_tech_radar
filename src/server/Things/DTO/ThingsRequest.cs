using System;
using System.Collections.Generic;
using ServiceStack.ServiceHost;
using NLog;

namespace Sioux.TechRadar
{
	/// <summary>
	/// Things is a request object that is used to request a List<Thing>.
	/// It is not a response object.
	/// </summary>
	[Route("/things")]
	[Route("/things/{names}")]
	public class ThingsRequest : IReturn<List<Thing>>
	{
		public string[] Names{ get;  set; }
		private static Logger log = LogManager.GetLogger("Server");
	}
}

