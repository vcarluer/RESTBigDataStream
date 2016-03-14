using DynamicRestProxy.PortableHttpClient;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RESTBigDataClient
{
	public class Program
	{
		static void Main(string[] args)
		{
			var t = TestData();
			t.Wait();
		}
		private static async Task TestData()
		{
			Stopwatch watch = new Stopwatch();
			watch.Start();
			using (dynamic localrest = new DynamicRestClient("http://localhost:8072/500"))
			{				
				dynamic testData = await localrest.get();
				watch.Stop();
				Console.WriteLine(String.Format("Data retrieved in {0} ms", watch.ElapsedMilliseconds));
				Console.WriteLine("Count: " + testData.data.Count);
				Console.WriteLine("Prop0 of first object: " + testData.data[0].prop0);
				Console.WriteLine("Prop9 of last object: " + testData.data[testData.data.Count -1].prop9);
				Console.ReadKey();
			}
		}
	}
}
