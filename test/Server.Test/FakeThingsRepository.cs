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


		public void Dispose ()
		{
			Things.Clear();
		}

		public IEnumerable<Thing> Store (Thing thing)
		{
			Things.AddLast(thing);
			return Things;
		}

		public IEnumerable<Thing> GetByName (string[] names)
		{
			return Things.Where( t => names.Contains(t.Name));
		}

		public IEnumerable<Thing> GetAll ()
		{
			return Things;
		}

	}
}

