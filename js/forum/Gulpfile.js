var gulp = require('flarum-gulp');

gulp({
    modules: {
        'treefiction/polls': [
            '../lib/**/*.js',
            'src/**/*.js'
        ]
    }
});
