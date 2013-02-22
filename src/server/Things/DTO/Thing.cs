
using System;
using System.Linq;
using ServiceStack.ServiceHost;

namespace Sioux.TechRadar
{
	/// <summary>
	/// A thing is both a request(hence the IReturn) and a response object.
	/// A thing can be request when it is PUT or POSTed, i.e. updated or added.
	/// A thing is in most cases a response object.
	/// </summary>
	[Route("/things/{name}","POST")] // update
	[Route("/things","PUT")] // create
	public class Thing : IReturn<Thing>
	{
		public string Name{ get; set; }
		public string Description{ get; set; }
		public Quadrant Quadrant{ get; set; }

		private char[] SplitChars = new char[]{',','.',' '};
		public bool SoundsKindaLike (string[] keywords)
		{
			var descriptionWords = Description.ToLower().Split(SplitChars).Union( Name.ToLower().Split(SplitChars));
			return keywords.Any( keyword => descriptionWords.Contains(keyword.ToLower()));
		}
	}

	public enum Quadrant{
		Tools, Techniques, Platforms, Languages
	}
}

