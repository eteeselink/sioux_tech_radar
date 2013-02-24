using System;
using NDesk.Options;
using System.Collections.Generic;
using ServiceStack.WebHost.Endpoints;
using Funq;
using System.Runtime.InteropServices;
using NLog;
using ServiceStack.Logging;

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
			var opts = new OptionSet () {
				{ "port=",      (int v) => port = v },
				{ "h|?|help",   v => help = v != null },
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

			using (var server = new Server(){Port = port }) {
				server.Start();
				logger.Info("Sioux Technology Radar Server Created at {0}, listening on {1}", DateTime.Now, port);
				Console.ReadKey();
			}
		}


		public int Port{ get; internal set; }
		string Url{ get {
				return "http://*:" + Port + "/";
			}
		}

		public override void Configure(Container container)
		{
			container.Register<IThingsRepository>(new ThingsRepository());

		}

		public Server(): base("Sioux TechRadar Service", typeof(Server).Assembly) 
		{
			Port = DefaultPort;
			Init ();
		}

		public Server Start()
		{
			Start(Url);
			return this;
		}
	}
}
