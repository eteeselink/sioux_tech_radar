using System;
using System.IO;

namespace Sioux.TechRadar
{
	public class TempFile: IDisposable
	{
		public string Path{get; private set;}

		public TempFile () 
		{
			Path = System.IO.Path.GetTempFileName();
		}
		public TempFile Create()
		{
			File.Create(Path);
			return this;
		}
		public void Dispose()
		{
			if (File.Exists(Path)) 
			{
				File.Delete(Path);
			}
		}
	}
}

