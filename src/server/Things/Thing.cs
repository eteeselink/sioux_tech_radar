
using System;
using ServiceStack.ServiceHost;

namespace Sioux.TechRadar
{
	[Route("/things")]
	[Route("/things/{name}")]
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

