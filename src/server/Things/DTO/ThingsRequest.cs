using System;
using System.Linq;
using System.Collections.Generic;
using ServiceStack.ServiceHost;

namespace Sioux.TechRadar
{
	/// <summary>
	/// Things is a request object that is used to request a List<Thing>.
	/// It is not a response object.
	/// </summary>
	[Route("/things/search")] // get all
	[Route("/things/{names}")] //get by name
	public class ThingsRequest : IReturn<List<Thing>>
	{
		public string[] Names{ get;  set; }
		public Quadrant? Quadrant { get; set; }

		public ThingsRequest UrlEncodeNames()
		{
			Names = Names.Select( name => Uri.EscapeDataString(name)).ToArray();
			return this;
		}
	}
}

