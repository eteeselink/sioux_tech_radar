using System;
using System.Linq;
using ServiceStack.ServiceInterface;
using NLog;
using ServiceStack.Common.Web;
using System.Collections.Generic;
using System.Net;

namespace Sioux.TechRadar
{
    public class OpinionsService: Service
    {
        private static Logger logger = LogManager.GetLogger("OpinionsService");
        public IOpinionsRepository Repository { get; set; }  //Injected by IOC

        public IEnumerable<Opinion> Get(String name)
        {
            Console.WriteLine("Get received opinion string = " + name);
            return Repository.GetByName(name);
        }

        public object Post(Opinion opinion)
        {
            Console.WriteLine("Post received opinion string = " + opinion.ToString());
            return Repository.StoreUpdated(opinion);
        }

        public object Put(Opinion opinion)
        {
            Console.WriteLine("Put received opinion string = " + opinion.ToString());
            return Repository.StoreNew(opinion);       
        }
    }
}
