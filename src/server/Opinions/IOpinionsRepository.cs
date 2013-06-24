using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar
{
    public interface IOpinionsRepository
    {
        IEnumerable<Opinion> GetByName(string name, string username);

         object StoreUpdated(Opinion opinion);

         object StoreNew(Opinion opinion);

         void Delete(string name, string username);

         IEnumerable<Opinion> GetAll(string username);
    }
}
