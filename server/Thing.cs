
using System;
using ServiceStack.ServiceHost;

namespace Sioux.TechRadar
{
	[Route("/things")]
	[Route("/things/{name}")]
	public class Thing : IReturn<Thing>
	{
		public string name{ get; set; }
		public string description{ get; set; }
		public Quadrant quadrant{ get; set; }
	}

	public enum Quadrant{
		Tools, Techniques, Platforms, Languages
	}
}

