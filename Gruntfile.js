module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		jshint : {
			// define the files to lint
			files : ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options : {
				// more options here if you want to override JSHint defaults
				globals : {
					jQuery : true,
					console : true,
					module : true
				}
			}
		},
		qunit : {
			files : ['test/**/*.html']
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src : 'src/<%= pkg.name %>.js',
				dest : 'build/<%= pkg.name %>.min.js'
			}
		},
		connect : {
			server : {
				options : {
					port : 8000,
					base : '.',
					keepalive : true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
	grunt.registerTask('travis_ci', ['jshint', 'qunit']);
};
