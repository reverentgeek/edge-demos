var request = require( 'request-json' ),
    async   = require( 'async' ),
    edge    = require( 'edge' );

describe.skip('Benchmark tests', function(){
    this.timeout(0);
    var iterations = 200;

    it('should benchmark native node call', function(done) {
        var nativeCalls = [];
        for(var i = 0; i < iterations; i++) {
            (function(i) {
                nativeCalls.push(function(callback) {
                    var result = i + i;
                    callback(null, result);
                });
            })(i);
        }
        var start = new Date();
        async.series(nativeCalls, function(err, results) {
            var totalTime = (new Date() - start);
            var averageResponse = totalTime / iterations;
            if (err) console.log('Error:', err);
            console.log('Average Response: ' + averageResponse + 'ms');
            //console.log(results);
            done();
        });
    });

    it('should benchmark edge call', function(done) {
       var calc = edge.func(function(){/*
        async(input) => {
            var i = (int) input;
            return i + i;
        }
       */});

       var edgeCalls = [];
        for(var i = 0; i < iterations; i++) {
            (function(i) {
                edgeCalls.push(function(callback) {
                    calc(i, function(err, result) {
                        callback(null, result);
                    });
                });
            })(i);
        }
        var start = new Date();
        async.series(edgeCalls, function(err, results) {
            var totalTime = (new Date() - start);
            var averageResponse = totalTime / iterations;
            if (err) console.log('Error:', err);
            console.log('Average Response: ' + averageResponse + 'ms');
            //console.log(results);
            done();
        });
    });

    it('should benchmark web service call', function(done) {
        var client = request.newClient('http://benchmark.aspnet.local/api/');
        var restCalls = [];
        for(var i = 0; i < iterations; i++) {
            (function(i) {
                restCalls.push(function(callback) {
                    client.get('calculator/add/' + i + '/' + i, function(err, res, body) {
                        //console.log(body);
                        callback(null, body);
                    });                    
                });
            })(i);
        }

        var start = new Date();
        async.series(restCalls, function(err, results) {
            var totalTime = (new Date() - start);
            var averageResponse = totalTime / iterations;
            if (err) console.log('Error:', err);
            console.log('Average Response: ' + averageResponse + 'ms');
            // console.log(results);
            done();
        });
    });
});