module.exports = function(grunt) {

var jsClientSourceFiles = [ 
  'lib/javascripts/array.js',
  'lib/javascripts/vector.js',
  'lib/javascripts/store.js',
  'lib/javascripts/cookie.js',
  'lib/javascripts/moving_object.js',
  'lib/javascripts/asteroid.js',
  'lib/javascripts/global_game.js',
  'lib/javascripts/client_game.js',
  'lib/javascripts/game.js',
  'lib/javascripts/game_mp.js',
  'lib/javascripts/ship.js',
  'lib/javascripts/key_listener.js',
  'lib/javascripts/bullet.js',
  'lib/javascripts/black_hole.js',
  'lib/javascripts/visuals.js',
  'lib/javascripts/init.js',
  'lib/javascripts/text.js',
  'lib/javascripts/exhaust_particle.js',
  'lib/javascripts/background.js',
  'lib/javascripts/star.js',
  'lib/javascripts/client_listener.js'
];

var jsServerSourceFiles = [ 
  'lib/javascripts/array.js',
  'lib/javascripts/vector.js',
  'lib/javascripts/store.js',
  'lib/javascripts/moving_object.js',
  'lib/javascripts/asteroid.js',
  // 'lib/javascripts/game.js',
  // 'lib/javascripts/game_mp.js',
  'lib/javascripts/ship.js',
  'lib/javascripts/bullet.js',
  'lib/javascripts/black_hole.js',
  'lib/javascripts/global_game.js',
  'server_game.js',
  'server_listener.js',
  'server_responder.js',
  'server_sessions.js'
  // 'lib/javascripts/key_listener.js',
  // 'lib/javascripts/visuals.js',
  // 'lib/javascripts/init.js',
  // 'lib/javascripts/text.js',
  // 'lib/javascripts/exhaust_particle.js',
  // 'lib/javascripts/background.js',
  // 'lib/javascripts/star.js',
  // 'lib/javascripts/client_listener.js'
];


  grunt.initConfig({
    jsDir: 'lib/javascripts/',
    jsDistDir: 'public/javascripts/',
    cssDir: 'lib/stylesheets/',
    cssDistDir: 'public/stylesheets/',
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      clientJS: {
        src: jsClientSourceFiles,
        dest: '<%=jsDistDir%><%= pkg.name %>.js'
      },
      serverJS: {
        options: {
          separator: ';',
          footer: '\nmodule.exports = Asteroids;\nglobal.Vector = this.Vector;'
        },
        src: jsServerSourceFiles,
        dest: '<%= pkg.name %>.js'
      }
    },
    sass: {
      dist: {
        files: {
            '<%= cssDistDir %><%= pkg.name %>.css': '<%= cssDir %>main.scss'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%=grunt.template.today("dd-mm-yyyy") %> -- Visit github.com/aaronik/asteroids for the unminified javascript. */\n'
      },
      dist: {
        files: {
          '<%=jsDistDir%><%= pkg.name %>.min.js': ['<%= concat.clientJS.dest %>']
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%=grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          '<%=cssDistDir%><%= pkg.name %>.min.css': ['<%= cssDistDir %><%= pkg.name %>.css']
        }
      }
    },
    watch: {
      files: ['<%=jsDir%>*.js', '<%=cssDir%>*.scss', './*'],
      tasks: ['build']
    },
    nodemon: {
      dev: {}
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('build', [
    'concat',
    'sass',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('default', [
    'build',
    'concurrent'
  ]);
  
};
