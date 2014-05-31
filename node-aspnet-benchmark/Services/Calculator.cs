using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ServiceStack;

namespace node_aspnet_benchmark.Services
{

	[Route("/calculator/add/{x}/{y}")]
	public class CalculatorAddRequest : IReturn<int>
	{
		public int x { get; set; }
		public int y { get; set; }
	}

	public class CalculatorService : Service
	{
		public object Get(CalculatorAddRequest request)
		{
			return request.x + request.y;
		}
	}
}