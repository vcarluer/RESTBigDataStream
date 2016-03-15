using DynamicRestProxy.PortableHttpClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
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
			if (mode == 4) t = TestSendDataStreamManual();

			if (t != null)
			{
				t.Wait();
			}

			watch.Stop();
			Console.WriteLine(String.Format("Data retrieved in {0} ms", watch.ElapsedMilliseconds));

			Console.ReadKey();

		}

		private static int mode = 4;
		private static string url = "http://localhost:8072/15";


		// THE NEXT 2 FUNCTIONS CAN HANDLE UNLIMITED SIZE OF OBJECT OR JSON

		// THIS READ AND DESERIALIZE THE JSON STREAM ON THE FLY
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

		// THIS SERIALIZES MANUALLY THE OBJECT TO JSON AND STREAMS REGULARY TO HTTP
		private static async Task TestSendDataStreamManual()
		{
			// http://www.thomaslevesque.com/2013/11/30/uploading-data-with-httpclient-using-a-push-model/
			using (HttpClient httpClient = new HttpClient())
			{
				Console.WriteLine("default timeout: " + httpClient.Timeout);
				httpClient.Timeout = new TimeSpan(0, 5, 0);
				Console.WriteLine("timeout raised to 5mn");
				dynamic obj = CreateBigObject(100); // 5000 = 1GB json

				var client = new HttpClient();

				// THIS IS MANDATORY TO STREAM AND NOT BUFFER DATA
				client.DefaultRequestHeaders.TransferEncodingChunked = true;

				var content = new PushStreamContent((stream, httpContent, transportContext) =>
				{
					using (var streamWriter = new StreamWriter(stream))
					using (var writer = new JsonTextWriter(streamWriter))
					{
						writer.WriteStartObject();
						writer.WritePropertyName("data");
						writer.WriteStartArray();
						foreach (dynamic item in obj.data)
						{
							writer.WriteStartObject();
							writer.WritePropertyName("prop0");
							writer.WriteValue(item.prop0);
							writer.WritePropertyName("prop1");
							writer.WriteValue(item.prop1);
							writer.WritePropertyName("prop2");
							writer.WriteValue(item.prop2);
							writer.WritePropertyName("prop3");
							writer.WriteValue(item.prop3);
							writer.WritePropertyName("prop4");
							writer.WriteValue(item.prop4);
							writer.WritePropertyName("prop5");
							writer.WriteValue(item.prop5);
							writer.WritePropertyName("prop6");
							writer.WriteValue(item.prop6);
							writer.WritePropertyName("prop7");
							writer.WriteValue(item.prop7);
							writer.WritePropertyName("prop8");
							writer.WriteValue(item.prop8);
							writer.WritePropertyName("prop9");
							writer.WriteValue(item.prop9);
							writer.WriteEndObject();

							// FLUSH TO STREAMS
							writer.Flush();
							streamWriter.Flush();
						}

						writer.WriteEndArray();
						writer.WriteEndObject();
					}
				});

				var response = await client.PostAsync(url, content);
				response.EnsureSuccessStatusCode();
			}
		}

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

		private static async Task WriteToStream(Stream outputStream, HttpContent content, TransportContext context)
		{
			try
			{
				for (int i = 0; i < 100; i++)
				{
					Console.Write("#");
					await outputStream.WriteAsync(new byte[1] { 0 }, 0, 1);
					await outputStream.FlushAsync();
					await Task.Delay(1000);
				}
			}
			finally
			{
				outputStream.Close();
			}
		}		

		private static async Task TestSendDataStream()
		{
			// http://www.thomaslevesque.com/2013/11/30/uploading-data-with-httpclient-using-a-push-model/
			using (HttpClient httpClient = new HttpClient())
			{
				var obj = CreateBigObject(5000);

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

		private static dynamic CreateBigObject(int size)
		{
			object[] list = new object[1000 * size];
			for (int i = 0; i < 1000 * size; i++)
			{
				dynamic obj = new
				{
					prop0 = "bbbbbbbbbb",
					prop1 = "bbbbbbbbbb",
					prop2 = "bbbbbbbbbb",
					prop3 = "bbbbbbbbbb",
					prop4 = "bbbbbbbbbb",
					prop5 = "bbbbbbbbbb",
					prop6 = "bbbbbbbbbb",
					prop7 = "bbbbbbbbbb",
					prop8 = "bbbbbbbbbb",
					prop9 = "bbbbbbbbbb",
					prop10 = "bbbbbbbbbb"
				};

				list[i] = obj;
			}

			return new { data = list };
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
