using System;


namespace Sioux.TechRadar
{
	class MainClass
	{
		public static void Main(string[] args)
		{
			var listeningOn = args.Length == 0 ? "http://*:8888/" : args[0];
			var appHost = new AppHost();
			appHost.Init();
			appHost.Start(listeningOn);
			
			Console.WriteLine("AppHost Created at {0}, listening on {1}", DateTime.Now, listeningOn);
			Console.ReadKey();
		}
	}
}
