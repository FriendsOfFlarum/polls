var gulp = require('gulp');

gulp.task('default', function() {
    gulp.src([
        'node_modules/datetimepicker/dist/DateTimePicker.min.css'
    ]).pipe(gulp.dest('dist'));
});
