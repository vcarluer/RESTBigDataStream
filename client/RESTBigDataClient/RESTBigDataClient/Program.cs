using DynamicRestProxy.PortableHttpClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace RESTBigDataClient
{
	public class Program
	{
		static void Main(string[] args)
		{
			TestData();
		}
		private static void TestData()
		{			
			Stopwatch watch = new Stopwatch();
			watch.Start();

			Task t = null;
			if (mode == 0) t = TestWithDynamicRestClient();
			if (mode == 1) t = TestWithHttpClientAndStream();
			if (mode == 2) t = TestSendData();
			if (mode == 3) t = TestSendDataStream();

			if (t != null)
			{
				t.Wait();
			}
			
			watch.Stop();
			Console.WriteLine(String.Format("Data retrieved in {0} ms", watch.ElapsedMilliseconds));

			Console.ReadKey();

		}

		private static int mode = 3;
		private static string url = "http://localhost:8072/15";

		private static async Task TestWithDynamicRestClient()
		{
			using (dynamic localrest = new DynamicRestClient(url))
			{
				dynamic testData = await localrest.get();
				WriteData(testData);
			}
		}

		private static async Task TestSendData()
		{
			var obj = new
			{
				data = "toto"
			};

			var json = JsonConvert.SerializeObject(obj);
			using (HttpClient httpClient = new HttpClient())
			{
				HttpContent content = new StringContent(json);
				await httpClient.PostAsync(url, content);
			}
		}

		private static async Task TestSendDataStream()
		{
			// http://www.thomaslevesque.com/2013/11/30/uploading-data-with-httpclient-using-a-push-model/
			using (HttpClient httpClient = new HttpClient())
			{
				var obj = new
				{
					data = "toto"
				};

				var client = new HttpClient();
				var content = new PushStreamContent((stream, httpContent, transportContext) =>
				{
					var serialier = new JsonSerializer();
					using (var writer = new StreamWriter(stream))
					{
						serialier.Serialize(writer, obj);
					}
				});

				var response = await client.PostAsync(url, content);
				response.EnsureSuccessStatusCode();				
			}
		}

		private static async Task TestWithHttpClientAndStream()
		{
			// http://www.newtonsoft.com/json/help/html/Performance.htm
			using (HttpClient httpClient = new HttpClient())
			{
				dynamic testData;
				using (Stream stream = httpClient.GetStreamAsync(url).Result)
				using (StreamReader streamReader = new StreamReader(stream))
				using (JsonReader jsonReader = new JsonTextReader(streamReader))
				{
					JsonSerializer serializer = new JsonSerializer();
					testData = serializer.Deserialize(jsonReader);
				}

				WriteData(testData);
			}
		}

		private static void WriteData(dynamic testData)
		{
			Console.WriteLine("Count: " + testData.data.Count);
			Console.WriteLine("Prop0 of first object: " + testData.data[0].prop0);
			if (testData.data[0].prop10)
			{
				Console.WriteLine("Prop0 of first object: " + testData.data[0].prop10);
			}
			else
			{
				Console.WriteLine("No Prop10");
			}
			
			Console.WriteLine("Prop9 of last object: " + testData.data[testData.data.Count - 1].prop9);
		}
	}
}
