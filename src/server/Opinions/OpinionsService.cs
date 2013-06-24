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

        public IEnumerable<Opinion> Get(Opinion opinion)
        {
            var session = this.GetSession();
            Console.WriteLine("getting opinions for user:" + session.UserName);
            if (opinion.thingName == null ){
                return Repository.GetAll(session.UserName);
            }else{
                return Repository.GetByName(opinion.thingName, session.UserName);
            }
        }


        public object Put(Opinion opinion)
        {
            var session = this.GetSession();
            opinion.user = session.UserName;
            Console.WriteLine("Put received opinion string = " + opinion.thingName);
            return Repository.StoreUpdated(opinion);
        }

        public object Post(Opinion opinion)
        {
            var session = this.GetSession();
            opinion.user = session.UserName;
            Console.WriteLine("Post received opinion string = " + opinion.ToString());
            return Repository.StoreNew(opinion);       
        }

        public void Delete(Opinion opinion){
            var session = this.GetSession();            
            Console.WriteLine("Delete received opinion string = " + opinion.thingName);
            Repository.Delete(opinion.thingName, session.UserName);
        }
    }
}
