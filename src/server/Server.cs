using System;
using NLog;
using NDesk.Options;
using System.Collections.Generic;

namespace Sioux.TechRadar
{
	public 	class Server : IDisposable
	{
		const int DefaultPort = 8888;

		private static Logger logger = LogManager.GetLogger("Server");

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
		public AppHost AppHost { get ; private set; }

		public Server ()
		{
			Port =  8888;
			AppHost = new AppHost();
			AppHost.Init();
		}

		public void Start()
		{
			AppHost.Start(Url);
		}

		public void Stop()
		{
			if (AppHost != null) AppHost.Stop();
			AppHost.Dispose();
		}

		public void Dispose()
		{
			Stop ();
		}

	}
}
