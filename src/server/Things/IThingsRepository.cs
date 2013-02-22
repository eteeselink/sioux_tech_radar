using System;
using System.Collections.Generic;


namespace Sioux.TechRadar
{
	public interface IThingsRepository : IDisposable
	{
		Thing Store(Thing thing);
		IEnumerable<Thing> GetByName (string[] names);	
		IEnumerable<Thing> GetAll();
	}
}

