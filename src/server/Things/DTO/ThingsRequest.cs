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
	[Route("/things")] // get all
	[Route("/things/{names}")] //get by name
	public class ThingsRequest : IReturn<List<Thing>>
	{
		public string[] Names{ get;  set; }
		public ThingsRequest UrlEncodeNames()
		{
			var encodedNames = Names.Select( name => Uri.EscapeDataString(name));
			return new ThingsRequest(){ Names = encodedNames.ToArray() };
		}
	}
}

