var gulp = require('flarum-gulp');

gulp({
    modules: {
        'reflar/polls': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
