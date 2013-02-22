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
		public string[] Keywords { get; set; }

		/// <summary>
		/// any get url params are not url-encoded by the client... 
		/// so we need this urlencode method that modifies this object and returns its own instance
		/// </summary>
		/// <returns>The encode names.</returns>
		public ThingsRequest UrlEncodeNames()
		{
			Names = Names.Select( name => Uri.EscapeDataString(name)).ToArray();
			return this;
		}
	}
}

