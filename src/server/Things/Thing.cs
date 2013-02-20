
using System;
using ServiceStack.ServiceHost;
using NLog;

namespace Sioux.TechRadar
{
	[Route("/things","POST")]
	[Route("/things/{name}","PUT")]
	public class Thing : IReturn<Thing>
	{
		private static Logger log = LogManager.GetLogger("Server");
		public Thing()
		{
			log.Debug ("constructing thing");
		}

		public string Name{ get; set; }
		public string Description{ get; set; }
		public Quadrant Quadrant{ get; set; }
	}

	public enum Quadrant{
		Tools, Techniques, Platforms, Languages
	}
}

