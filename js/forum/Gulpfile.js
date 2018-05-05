var gulp = require('flarum-gulp');

gulp({
    files: [
        'node_modules/datetimepicker/dist/DateTimePicker.min.js'
    ],
    modules: {
        'reflar/polls': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
