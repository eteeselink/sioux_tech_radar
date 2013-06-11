using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar
{
    public interface IOpinionsRepository : IDisposable
    {
        IEnumerable<Opinion> GetByName(string name);

        object StoreUpdated(Opinion opinion);

        object StoreNew(Opinion opinion);
    }
}
