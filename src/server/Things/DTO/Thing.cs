
using System;
using ServiceStack.ServiceHost;

namespace Sioux.TechRadar
{
	/// <summary>
	/// A thing is both a request(hence the IReturn) and a response object.
	/// A thing can be request when it is PUT or POSTed, i.e. updated or added.
	/// A thing is in most cases a response object.
	/// </summary>
	[Route("/things","POST")]
	[Route("/things/{name}","PUT")]
	public class Thing : IReturn<Thing>
	{
		public string Name{ get; set; }
		public string Description{ get; set; }
		public Quadrant Quadrant{ get; set; }
	}

	public enum Quadrant{
		Tools, Techniques, Platforms, Languages
	}
}

