using System;
using NDesk.Options;
using System.Collections.Generic;
using ServiceStack.WebHost.Endpoints;
using Funq;
using System.Runtime.InteropServices;
using NLog;
using ServiceStack.Logging;

//GE
using ServiceStack.ServiceClient.Web;
using System.Net;

namespace Sioux.TechRadar
{
	public 	class Server : AppHostHttpListenerBase
	{
		const int DefaultPort = 8888;

		private static Logger logger = NLog.LogManager.GetLogger("Server");

		static void ShowHelp (OptionSet p)
		{
			Console.WriteLine ("Usage: Server [OPTIONS]+ message");
			Console.WriteLine ("Starts a Sioux Technology Radar SErver");
			Console.WriteLine ();
			Console.WriteLine ("Options:");
			p.WriteOptionDescriptions (Console.Out);
		}

		public static void Main (string[] args)
		{
			//ServiceStack.Logging.LogManager.LogFactory = new ServiceStack.Logging.NLogger.NLogFactory();

			int port = DefaultPort;
			bool help = false;
			string sqliteFile = "tempDB.sqlite";
			var opts = new OptionSet () {
				{ "port=",      (int v) => port = v },
				{ "h|?|help",   v => help = v != null },
				{ "sqlitefile=", v => sqliteFile = v },
			};

			try {
				opts.Parse (args);
			}
			catch (OptionException e) {
				Console.WriteLine (e.Message);
				Console.WriteLine ("Try `Server --help' for more information.");
				return;
			}
			
			if (help) {
				ShowHelp(opts);
				return;
			}

            Console.WriteLine("Server running..");


            using (var server = new Server() { Port = port, SqliteFile = sqliteFile })
            {
                server.Start();
                logger.Info("Sioux Technology Radar Server Created at {0}, listening on {1}", DateTime.Now, port);
                Console.ReadKey();
            }
		}

	

		public int Port{ get; internal set; }
		public string SqliteFile { get; internal set; }

		string Url{ get {
				return "http://+:" + Port + "/";
			}
		}

		public override void Configure(Container container)
		{
			var factory = new SqLiteConnectionFactory(){ 
				ConnectionString = SqliteFile
			};

			container.Register<IThingsRepository>(
				new ThingsRepository(){ 
					ConnectionFactory =  factory
			    }.EnsureTablesExist()
			);
			SetConfig(new EndpointHostConfig { ServiceStackHandlerFactoryPath = "api", 
												MetadataRedirectPath = "api/metadata" });
		
		}

		public Server(): base("Sioux TechRadar Service", typeof(Server).Assembly) 
		{
			Port = DefaultPort;		
		}

		public Server Start()
		{
			Init ();
			Start(Url);
			return this;
		}

        protected override void ProcessRequest(System.Net.HttpListenerContext context)
        {
            Console.WriteLine(context.Request.Url);
            base.ProcessRequest(context);
        }
	}
}
