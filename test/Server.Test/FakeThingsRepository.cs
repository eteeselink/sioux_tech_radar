using System;
using System.Linq;
using System.Data.Linq;
using System.Collections.Generic;

namespace Sioux.TechRadar
{
	public class FakeThingsRepository : IThingsRepository
	{
		public LinkedList<Thing> Things{ get; set; }

		public FakeThingsRepository ()
		{
			Things = new LinkedList<Thing>();
		}

		public Thing SetupFakeThing()
		{
			var csharp = new Thing(){Name=@"C#"};
			this.Things.AddFirst(csharp);
			return csharp;
		}


		public void Dispose ()
		{

		}

		public IEnumerable<Thing> Store (Thing thing)
		{
			Things.AddLast(thing);
			return Things;
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			var result =  Things.Where( thing => names.Contains( thing.Name ));
			var count = result.Count();
			return result;
		}

		public IEnumerable<Thing> GetAll ()
		{
			return Things;
		}

	}
}

