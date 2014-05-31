var async   = require( 'async' ),
    edge    = require( 'edge' ),
    http    = require( 'http' );

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

    it('should benchmark RabbitMQ publish call', function(done) {
        var rabbit;
        var config = {
            connection: {
                user: 'admin',
                pass: 'admin',
                server: '10.37.129.3',
                port: 5672,
                vhost: '/edge'
                },
            exchanges:[
                { name: 'edge-ex.1', type: 'fanout'  },
                { name: 'dead-letter-ex.1', type: 'fanout' }
                ],
            queues:[
                { name:'edge-q.1', limit: 100, queueLimit: 1000, deadLetter: 'dead-letter-ex.1' }
                ],
            bindings:[
                { exchange: 'edge-ex.1', target: 'edge-q.1' }
            ]
        };

        rabbit = require( 'wascally' );
        rabbit.on('error', function(err) {
            console.log(err);
            done();
        })
        rabbit.configure( config ).done( function() {
            var rabbitCalls = [];
            for(var i = 0; i < iterations; i++) {
                (function(i) {
                    rabbitCalls.push(function(callback) {
                        var message = { x: i, y: i };
                        rabbit.publish( 'edge-ex.1', 'edge.benchmarks.messages.testMessage', message );
                        callback(null, i);
                    });
                })(i);
            }
            var start = new Date();
            async.series(rabbitCalls, function(err, results) {
                var totalTime = (new Date() - start);
                var averageResponse = totalTime / iterations;
                if (err) console.log('Error:', err);
                console.log('Average Response: ' + averageResponse + 'ms');
                // console.log(results);
                done();
            });
        } );

        after(function(done) {
            rabbit.closeAll( true )
                .then( function() {
                    done();
                } );
        })

    });

    it('should benchmark web service call', function(done) {

        var restCalls = [];
        for(var i = 0; i < iterations; i++) {
            (function(i) {
                restCalls.push(function(callback) {
                    var result = 0;
                    var url = 'http://benchmark.aspnet.local/api/calculator/add/' + i + '/' + i + '?format=json'
                    http.get(url, function(res) {
                        // console.log(res);
                        res.on('data', function(chunk) {
                            result = parseInt(chunk.toString());
                            //console.log(result);
                        });
                        res.on('end', function() {
                            callback(null, result);
                        });
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