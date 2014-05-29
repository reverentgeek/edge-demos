var gulp = require( 'gulp' ),
  gutil = require( 'gulp-util' ),
	mocha = require( 'gulp-mocha' );

gulp.task( 'test', function() {
	return gulp.src( './spec/*.spec.js' )
		.pipe( mocha( { reporter: 'spec' } ) )
		.on( 'error', gutil.log );
} );

// gulp.task( 'watch', function() {
// 	gulp.watch( [ './spec/*.spec.js', './src/*.js' ], [ 'test' ] );
// } );

// gulp.task( 'default', [ 'test', 'watch' ], function() {
//
// } );

gulp.task( 'default', [ 'test' ], function() {

} );
