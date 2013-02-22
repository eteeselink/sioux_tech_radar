using ServiceStack.ServiceHost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sioux.TechRadar
{
    public class ThingsRequest : IReturn<IEnumerable<Thing>>
    {
        public ThingsRequest(string[] names)
        {
            this.Names = names;
        }
        public string[] Names { get; private set; }
    }
}
