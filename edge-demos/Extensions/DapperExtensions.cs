using System;
using System.Collections.Generic;
using Dapper;

namespace edgedemos
{
	public static class DapperExtensions
	{
		public static DynamicParameters ToDapperParameters(this IDictionary<string, object> input)
		{
			var parameters = new DynamicParameters();
			if (input == null)
				return parameters;

			foreach (KeyValuePair<string, object> parameter in input) {
				parameters.Add (parameter.Key, parameter.Value);
			}
			return parameters;
		}
	}
}

