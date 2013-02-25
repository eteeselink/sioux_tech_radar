
using System;
using System.Linq;
using ServiceStack.ServiceHost;
using ServiceStack.DataAnnotations;

namespace Sioux.TechRadar
{
	/// <summary>
	/// A thing is both a request(hence the IReturn) and a response object.
	/// A thing can be request when it is PUT or POSTed, i.e. updated or added.
	/// A thing is in most cases a response object.
	/// </summary>
	[Route("/api/things/{name}","POST")] // update
	[Route("/api/things","PUT")] // create
	public class Thing : IReturn<Thing>
	{
		[PrimaryKey]
		public string Name{ get; set; }
		public string Description{ get; set; }
		public Quadrant Quadrant{ get; set; }

		private char[] SplitChars = new char[]{',','.',' '};
		/// <summary>
		/// Checks if this thing is a possible result of a search with the given keywords.
		/// </summary>
		/// <returns><c>true</c>, if any aspect of this Thing is related to any of the keywords</returns>
		/// <param name="keywords">Keywords.</param>
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

