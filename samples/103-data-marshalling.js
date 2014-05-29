var edge = require( 'edge' );


var testMarshalling = edge.func(function () {/*
using System.Collections.Generic;
async (input) =>
{
    Console.WriteLine("");
    Console.WriteLine("Data from Node.js to .NET :");
    Console.WriteLine("===========================");
    var data = (IDictionary<string, object>) input;
    foreach (var kv in data)
    {
        Console.WriteLine("{0} ({1}): {2}", kv.Key, kv.Value.GetType(), kv.Value);
    }
    Console.WriteLine("");

    var result = new {
        anInteger = 1,
        aNumber = 3.1415,
        sString = "String Value",
        aBool = true,
        anObject = new { a = "1", b = "2" },
        anArray = new int[] { 1, 2, 3 },
        aBuffer = new byte[1024]
    };

    return result;
}
*/});

var data = {
    anInteger: 1,
    aNumber: 3.1415,
    aString: 'foobar',
    aBool: true,
    anObject: {},
    anArray: [ 'a', 1, true ],
    aBuffer: new Buffer(1024)
}

testMarshalling(data, function (err, result) {
  if (err) throw err;
  console.log('Data from .NET to Node.js')
  console.log('=========================')
  console.log(result);
});