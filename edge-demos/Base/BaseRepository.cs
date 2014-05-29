using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace edgedemos
{
	public class BaseRepository<T>
	{
		public string ConnectionString { get; set; }

		public BaseRepository ()
		{
			ConnectionString = Environment.GetEnvironmentVariable("EDGE_SQL_CONNECTION_STRING");
		}

		protected virtual async Task<object> PagedQueryAsync(string sql, IDictionary<string, object> input) {
			var queryTask = Task<object>.Factory.StartNew (() => PagedQuery(sql, input.ToDapperParameters()));
			return await queryTask;
		}

		protected virtual object PagedQuery(string sql, DynamicParameters param = null) {
			using (var connection = new SqlConnection(ConnectionString)) {
				connection.Open();
				var results = connection.QueryMultiple(sql, param);
				var rows = results.Read<T>();
				var totalRows = results.Read<int> ().FirstOrDefault();
				return new { count = rows.Count(), total = totalRows, value = rows };
			}
		}

		protected virtual async Task<T> QueryScalarAsync(string sql, IDictionary<string, object> input) {
			var queryTask = Task<T>.Factory.StartNew (() => QueryScalar(sql, input.ToDapperParameters()));
			return await queryTask;
		}

		protected virtual T QueryScalar(string sql, DynamicParameters param = null) 
		{
			using (var connection = new SqlConnection(ConnectionString)) 
			{
				connection.Open();
				return connection.Query<T>(sql, param).FirstOrDefault();
			}
		}

		protected virtual async Task<IEnumerable<T>> QueryManyAsync(string sql, IDictionary<string, object> input) {
			var queryTask = Task<IEnumerable<T>>.Factory.StartNew (() => QueryMany(sql, input.ToDapperParameters()));
			return await queryTask;
		}

		protected virtual IEnumerable<T> QueryMany(string sql, DynamicParameters param = null) 
		{
			using (var connection = new SqlConnection(ConnectionString))
			{
				connection.Open();
				return connection.Query<T>(sql, param);
			}
		}

		protected virtual async Task<T> ExecuteInsertAsync(string sql, IDictionary<string, object> input) {
			var queryTask = Task<T>.Factory.StartNew (() => ExecuteInsert(sql, input.ToDapperParameters()));
			return await queryTask;
		}

		protected virtual T ExecuteInsert(string sql, DynamicParameters param = null) 
		{
			using (var connection = new SqlConnection(ConnectionString))
			{
				connection.Open();
				return connection.Query<T>(sql, param).FirstOrDefault();
			}
		}

		protected virtual async Task<int> ExecuteUpdateAsync(string sql, IDictionary<string, object> input) {
			var queryTask = Task<int>.Factory.StartNew (() => ExecuteUpdate(sql, input.ToDapperParameters()));
			return await queryTask;
		}

		protected virtual int ExecuteUpdate(string sql, DynamicParameters param = null) 
		{
			using (var connection = new SqlConnection(ConnectionString))
			{
				connection.Open();
				return connection.Execute(sql, param);
			}
		}

		protected virtual async Task<int> ExecuteDeleteAsync(string sql, IDictionary<string, object> input) {
			var queryTask = Task<int>.Factory.StartNew (() => ExecuteDelete(sql, input.ToDapperParameters()));
			return await queryTask;
		}

		protected virtual int ExecuteDelete(string sql, DynamicParameters param = null)
		{
			using (var connection = new SqlConnection(ConnectionString))
			{
				connection.Open();
				return connection.Execute(sql, param);
			}
		}
	}
}

