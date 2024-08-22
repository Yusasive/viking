// Import Gulp and plugins
import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import * as sassCompiler from 'sass'; // Updated import syntax for Sass
import autoprefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-clean-css';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import browserSync from 'browser-sync';

// Set the Sass compiler
const sassCompilerInstance = sass(sassCompiler); // Correct way to use the Sass compiler

// Notify on error
const onError = (error) => {
    console.log(error.message);
    this.emit('end');
};

// HTML task
function html() {
    return gulp.src('src/html/*.html')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/html'
        }))
        .pipe(htmlmin({
            removeCommentsFromCDATA: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            caseSensitive: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('dist'));
}

// CSS task
function css() {
    return gulp.src('src/scss/main.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sassCompilerInstance({ outputStyle: 'compressed' }).on('error', sassCompilerInstance.logError)) // Use sassCompilerInstance
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(cssmin())
        .pipe(rename('production.css'))
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest('dist/css'));
}

// JS task
function js() {
    return gulp.src('src/js/**/*')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('production.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

// Image task
function images() {
    return gulp.src('src/img/**/*.+(png|jpeg|jpg|gif|svg)')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
}

// Start server
function browserSyncTask(done) {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
    done();
}

// Watch files
function watchFiles() {
    gulp.watch('src/html/**/*', html).on('change', browserSync.reload);
    gulp.watch('src/scss/**/*', css).on('change', browserSync.reload);
    gulp.watch('src/js/**/*', js).on('change', browserSync.reload);
    gulp.watch('src/img/**/*.+(png|jpeg|jpg|gif|svg)', images).on('change', browserSync.reload);
}

// Default task
const build = gulp.series(gulp.parallel(html, css, js, images));
const watch = gulp.series(build, gulp.parallel(browserSyncTask, watchFiles));

export default watch;
