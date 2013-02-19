using System;
using System.Collections.Generic;


namespace Sioux.TechRadar
{
	public interface IThingsRepository : IDisposable
	{
		IEnumerable<Thing> Store(Thing thing);
		IEnumerable<Thing> GetByName (string[] names);	
		IEnumerable<Thing> GetAll();
	}
}

