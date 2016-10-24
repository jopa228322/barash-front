var gulp = require("gulp");
    browserSync  = require('browser-sync'); 
    cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'); 
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglifyjs'),
    del          = require('del'), 
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'); 
    cache        = require('gulp-cache'); 
    autoprefixer = require('gulp-autoprefixer');
    sass = require('gulp-sass');
    bourbon = require("node-bourbon").includePaths;
    
gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});




gulp.task("sass", function() {
  return gulp.src("app/sass/**/*.sass")
      .pipe(sass({
        includePaths: bourbon
      }))
      .pipe(gulp.dest("app/css"))
      });





gulp.task('scripts', function() {
    return gulp.src([ 
        'app/libs/jquery/production/jquery.min.js' 
        ])
        .pipe(concat('libs.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest('app/js')); 
});
	gulp.task('watch', ['browser-sync','sass'], function() {
	   gulp.watch('app/*.html', browserSync.reload); 
	   gulp.watch('app/js/**/*.js', browserSync.reload);  
	   gulp.watch('app/sass/**/*.sass', ['sass',browserSync.reload]); 

	});
	gulp.task('img', function() {
	    return gulp.src('app/img/**/*') // Берем все изображения из app
	        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
	            interlaced: true,
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()]
	        })))
	        .pipe(gulp.dest('production/img')); // Выгружаем на продакшен
	});

gulp.task('clean', function() {
    return del.sync('production/**'); 
});

gulp.task('build', ['clean',  'img',   'scripts'], function() {

    var buildCss = gulp.src([ 
        'app/css/*.css'
        ])
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
    .pipe(cssnano()) 
    .pipe(gulp.dest('production/css'))

    var buildFonts = gulp.src('app/fonts/**/*') 
    .pipe(gulp.dest('production/fonts'))

    var buildJs = gulp.src('app/js/**/*') 
    .pipe(gulp.dest('production/js'))

    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('production'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})