﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace edgedemos
{
	public class DapperTests
	{
		private string _connectionString;

		public DapperTests () {
			_connectionString = Environment.GetEnvironmentVariable("EDGE_SQL_CONNECTION_STRING");
		}

		public async Task<object> QueryUsers(IDictionary<string, object> input) {

			var sql = @"
SET NOCOUNT ON;

DECLARE @RowStart int, @RowEnd int;
SET @RowStart = (@currentPage - 1) * @pageSize + 1;
SET @RowEnd = @currentPage * @pageSize;

WITH Paging AS
(
	SELECT	ROW_NUMBER() OVER (ORDER BY CreateDate DESC) AS RowNum,
			Id, FirstName, LastName, Email, CreateDate
	FROM	SampleUsers
	 
)
SELECT	Id, FirstName, LastName, Email, CreateDate
FROM	Paging
WHERE	RowNum BETWEEN @RowStart AND @RowEnd
ORDER BY RowNum;

SELECT	TotalCount = COUNT(*)
FROM	SampleUsers;
";
			return await PagedQueryAsync<SampleUser> (sql, input);
		}

		public async Task<object> PagedQueryAsync<T>(string sql, IDictionary<string, object> input) {
			var queryTask = Task<object>.Factory.StartNew (() => PagedQuery<T>(sql, input));
			return await queryTask;
		}

		public object PagedQuery<T>(string sql, IDictionary<string, object> input) {
			using (var connection = new SqlConnection (_connectionString)) {
				connection.Open();
				var results = connection.QueryMultiple(sql, input.ToDapperParameters());
				var rows = results.Read<T>();
				var totalRows = results.Read<int> ().FirstOrDefault();
				return new { count = rows.Count(), total = totalRows, value = rows };
			}
		}
	}
}

