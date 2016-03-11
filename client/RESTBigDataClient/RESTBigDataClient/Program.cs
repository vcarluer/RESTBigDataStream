using DynamicRestProxy.PortableHttpClient;
using System;
using System.Collections.Generic;
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
			using (dynamic localrest = new DynamicRestClient("http://localhost:8072/"))
			{
				dynamic testData = await localrest.get();
				Console.WriteLine("Count: " + testData.data.Count);
				Console.WriteLine("Count: " + testData.data[0].prop0);

			}
		}
	}
}
