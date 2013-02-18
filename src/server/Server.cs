using System;
using NLog;

namespace Sioux.TechRadar
{
	public 	class Server : IDisposable
	{
		private static Logger logger = LogManager.GetLogger("Server");
		public static void Main (string[] args)
		{
			int port = args.Length == 0 ? Int32.Parse(args[0]) : 8888;
			using (var server = new Server(){Port = port }) {
				server.Start();
				logger.Info("Sioux Technology Radar Server Created at {0}, listening on {1}", DateTime.Now, port);
				Console.ReadKey();
			}
		}

		public int Port{ get; internal set; }
		public string Url{ get {
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
		}

		public void Dispose()
		{
			Stop ();
		}

	}
}
