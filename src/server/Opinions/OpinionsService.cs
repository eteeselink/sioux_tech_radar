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

        public IEnumerable<Opinion> Get(OpinionRequest opinionRequest)
        {
            var session = this.GetSession();
            
            Console.WriteLine("getting opinions for user:" + opinionRequest.user);
            if (opinionRequest.thingName == null ){
                return Repository.GetAll(opinionRequest.user);
            }else{
                return Repository.GetByName(opinionRequest.thingName, opinionRequest.user);
            }
        }

        [Authenticate]
        public object Put(Opinion opinion)
        {
            var session = this.GetSession();
            if (session.UserName != opinion.user)
            {
                throw new HttpError(HttpStatusCode.MethodNotAllowed, "You can only edit your own opinions");
            }
            
            Console.WriteLine("Put received opinion string = " + opinion.thingName);
            return Repository.StoreUpdated(opinion);
        }

        [Authenticate]
        public object Post(Opinion opinion)
        {
            var session = this.GetSession();
            if (session.UserName != opinion.user)
            {
                throw new HttpError(HttpStatusCode.MethodNotAllowed, "You can only edit your own opinions");
            }

            opinion.user = session.UserName;
            Console.WriteLine("Post received opinion string = " + opinion.ToString());
            return Repository.StoreNew(opinion);       
        }

        [Authenticate]
        public void Delete(OpinionRequest opinionRequest){
            var session = this.GetSession();
            if (session.UserName != opinionRequest.user)
            {
                throw new HttpError(HttpStatusCode.MethodNotAllowed, "You can only delete your own opinions");
            }

            Console.WriteLine("Delete received opinion string = " + opinionRequest.thingName);
            Repository.Delete(opinionRequest.thingName, session.UserName);
        }
    }
}
