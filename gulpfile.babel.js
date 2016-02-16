// require('babel-core/register');
import gulp from 'gulp';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
// import connect from 'gulp-connect';
// import mocha from 'gulp-mocha';

const dir = {
  api: 'api/*.js',
  in: {
    js: 'src/js/**/*.js',
    scss: 'src/scss/**/*.scss',
    html: 'src/html/**/*.html',
    assets: 'src/assets/**/*'
  },
  out: {
    js: 'public/js',
    css: 'public/css',
    html: 'public/html',
    assets: 'public/assets'
  }
}

gulp.task('html', () => {
  return gulp.src(dir.in.html)
    .pipe(gulp.dest(dir.out.html))
});

gulp.task('assets', () => {
  return gulp.src(dir.in.assets)
    .pipe(gulp.dest(dir.out.assets))
});

gulp.task('sass', () => {
  return gulp.src(dir.in.scss)
    .pipe(sass())
    .pipe(gulp.dest(dir.out.css));
})

gulp.task('scripts', () => {
  return gulp.src(dir.in.js)
    .pipe(babel({
  			presets: ['es2015']
  	}))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(dir.out.js))
});


// gulp.task('test', () => {
//     return gulp.src('test/test-server.js', {read: false})
//         .pipe(mocha({reporter: 'spec'}))
// });


gulp.task('watch', () => {
    gulp.watch(dir.in.js, ['scripts']);
    gulp.watch(dir.in.scss, ['sass']);
    gulp.watch(dir.in.html, ['html']);
});


gulp.task('default', ['html', 'sass', 'scripts', 'assets', 'watch']);

gulp.task('deploy', ['html', 'sass', 'scripts', 'assets']);
