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
		concat : {
			build : {
				src : ['src/**/*.js'],
				dest : 'build/<%= pkg.name %>.js',
			},
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src : 'build/<%= pkg.name %>.js',
				dest : 'build/<%= pkg.name %>.min.js'
			}
		},
		jsdoc2md : {
			oneOutputFile : {
				src : "src/**/*.js",
				dest : "api/documentation.md"
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
		},
		release : {
			options : {
				npm : false, //default: true
				github : {
					repo : 'rsteube/remarkchart',
					usernameVar : 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
					passwordVar : 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains Github password
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
	grunt.loadNpmTasks('grunt-release');

	grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'jsdoc2md']);
	grunt.registerTask('travis_ci', ['jshint', 'qunit']);
};
