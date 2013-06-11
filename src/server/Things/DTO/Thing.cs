
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
    // TODO: POST should be for Create, and PUT for update. Also change in service.

	[Route("/api/things/{name}","PUT")] // update
	[Route("/api/things","POST")] // create
	public class Thing : IReturn<Thing>
	{
		[PrimaryKey]
		public string Name{ get; set; }
        public Quadrant Quadrantid { get; set; }
        public Quadrant Quadrant { get; set; }   //TODO double quadrant information -> refactor out.
        public string Title { get; set; }
        public string Description{ get; set; }

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
        Techniques, Tools, Languages, Platforms
    }
}

