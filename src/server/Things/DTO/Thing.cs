
using System;
using System.Linq;
using ServiceStack.ServiceHost;
using ServiceStack.DataAnnotations;
using System.Text.RegularExpressions;

namespace Sioux.TechRadar
{
    /// <summary>
    /// A thing is both a request(hence the IReturn) and a response object.
    /// A thing can be request when it is PUT or POSTed, i.e. updated or added.
    /// A thing is in most cases a response object.
    /// </summary>

    [Route("/api/things","POST")] // create
    public class Thing : IReturn<Thing>
    {
        [PrimaryKey]
        public string Name { get; set; }

        public Quadrant Quadrantid { get; set; } 

        public string Title { get; set; }
        public string Description{ get; set; }

        /// <summary>
        /// Whether or not a thing is supposed to "exist" when there are no associated opinions.
        /// </summary>
        public bool Sticky { get; set; }

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

        /// <summary>
        /// Derive name from title. Replaces weird characters by friendlier ones.
        /// </summary>
        public void SetName()
        {
            if (!String.IsNullOrWhiteSpace(Name))
            {
                throw new InvalidOperationException("Cannot set an already existing name");
            }
            var name = Title.ToLower()
                .Replace(",", "comma")
                .Replace(".", "dot")
                .Replace("-", "dash")
                .Replace("+", "plus")
                .Replace("/", "slash")
                .Replace("\\", "backslash")
                .Replace("!", "bang")
                .Replace("@", "at")
                .Replace("#", "sharp")
                .Replace("$", "dollar")
                .Replace("%", "percent")
                .Replace("^", "caret")
                .Replace("&", "and")
                .Replace("*", "times")
                .Replace("=", "equals");

            Name = Uri.EscapeDataString(name);  
        }
    }

    public enum Quadrant{
        Techniques=0, Tools=1, Languages=2, Platforms=3
    }
}

