using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace edgedemos
{
	public class SampleUserRepository : BaseRepository<SampleUser>
	{
		public async Task<object> GetPagedList(IDictionary<string, object> input) {
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
			return await PagedQueryAsync(sql, input);
		}
	}
}

