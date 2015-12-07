var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var wiredep = require('wiredep');

var $ = gulpLoadPlugins();

// Generate site styles from Sass with sourcemaps and run through autoprefixer
gulp.task('styles', function() {
	return gulp.src('build/styles/*.scss')
		.pipe($.plumber())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: ['last 1 version']
		}))
		.pipe(gulp.dest('.tmp/styles'));
});

// Process HTML files, minify included asset files (.js, .css)
gulp.task('html', ['styles'], function() {
	var assets = $.useref({
		searchPath: ['.tmp', 'build', '.']
	});

	return gulp.src('build/*.html')
		.pipe(assets)
		.pipe($.if('*.js', gulp.dest('.tmp')))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.minifyCss({
			compatibility: '*'
		})))
		.pipe($.useref())
		.pipe(gulp.dest('dist'));
});

// Copy images
gulp.task('images', function() {
	return gulp.src('build/images/*')
		.pipe(gulp.dest('dist/images'));
});

// Clean the build dir and remove temp files
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Inject bower components
gulp.task('wiredep', function() {
	gulp.src('build/styles/*.scss')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)+/
		}))
		.pipe(gulp.dest('build/styles'));

	gulp.src('build/*.html')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('build'));
});

// Main build task
gulp.task('build', ['html', 'images'], function() {
	return gulp.src('dist/**/*').pipe($.size({
		title: 'build',
		gzip: true
	}));
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('build');
});
