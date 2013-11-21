using Microsoft.Exchange.WebServices.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;

namespace Sioux.TechRadar.Users.Auth
{
    class SiouxExchangeServer
    {
        private const string Domain = "siouxehv.nl";
        //private const string ExchangeServer = "mail.sioux.eu";
        private const string ExchangeServer = "10.192.168.25";

        /// <summary>
        /// Connects with the Sioux Exchange server to check whether the given username/password are valid
        /// Sioux credentials. Note: this method may take a second or two.
        /// </summary>
        public static bool CheckLogin(string username, string password)
        {
            Console.WriteLine("Connecting to exchange server...");
            ServicePointManager.ServerCertificateValidationCallback = StolenCode.CertificateValidationCallBack;

            var service = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
            service.Credentials = new WebCredentials(username, password, Domain);
            service.Url = new Uri("https://" + ExchangeServer + "/EWS/Exchange.asmx");
            service.UseDefaultCredentials = false;

            try
            {
                // resolve a dummy name to force the client to connect to the server.
                service.ResolveName("garblwefuhsakldjasl;dk");
                return true;
            }
            catch (ServiceRequestException e)
            {
                // if we get a HTTP Unauthorized message, then we know the u/p was wrong.
                if (e.Message.Contains("401"))
                {
                    return false;
                } 
                throw;
            }
        }

        static void TestManually()
        {
            var ok = SiouxExchangeServer.CheckLogin("teeselinke", "sdlfjakljddsklj");
            Console.WriteLine(ok);
        }
    }
}
