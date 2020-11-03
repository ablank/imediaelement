module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks("grunt-remove-logging");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-stylelint');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');

  var rendererSources;

  // if commandline list of renderers, (e.g. --renderers=hls,dash,...) build only these
  var rendererList = grunt.option('features');
  if (rendererList) {
    rendererList = rendererList.split(',');
    rendererSources = [];
    rendererList.forEach(function (renderer) {
      var path = 'src/js/renderers/' + renderer + '.js';
      if (grunt.file.isFile(path)) {
        rendererSources.push(path);
      }
    });
  }
/**/

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['src/js/**/*.js', 'test/core/*.js'],
        tasks: ['eslint', 'browserify', 'concat', 'uglify', 'copy:translation']
      },
      stylesheet: {
        files: ['src/skins/**/*.css', 'src/skins/**/*.png', 'src/skins/**/*.svg', 'src/skins/**/*.gif'],
        tasks: ['postcss', 'copy:build']
      }
    },

    clean: {
      build: ['build/**/*', '!build/*.swf']
    },

    copy: {
      skinscss: {
        expand: true,
        flatten: false,
        cwd: 'src/skins/',
        src: ['**/*.css'],
        dest: 'build/skins/',
        filter: 'isFile',

      },
      translation: {
        expand: true,
        flatten: true,
        cwd: 'src/js/languages/',
        src: ['**/*.js'],
        dest: 'build/lang/',
        filter: 'isFile',
        options: {
          processContent: function (content) {
            content = content.replace(/\/\/.*?\.js/gm, '');
            return content.replace(/\n{2,}/gm, '');
          }
        }
      }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'src/js/core/*.js',
        'src/js/features/*.js',
        'src/js/languages/*.js',
        'src/js/renderers/*.js',
        'src/js/utils/*.js',
        'src/js/library.js',
        'src/js/player.js',
        'src/js/index.js',
        'test/core/*.js'
      ]
    },

    browserify: {
      dist: {
        files: {
          // core element
          'build/mediaelement.js': [
            'src/js/utils/polyfill.js',
            'src/js/core/mediaelement.js',
            'src/js/renderers/html5.js',
            'src/js/renderers/flash.js',
            //'src/js/features/i18n.js',
            //'src/js/languages/en.js',
          ].concat(rendererSources || [
            'src/js/renderers/dash.js',
            'src/js/renderers/flv.js',
            'src/js/renderers/hls.js',
            'src/js/renderers/youtube.js',
          ]),
          // all bundle
          'build/mediaelement-and-player.js': [
            'src/js/utils/polyfill.js',
            'src/js/core/mediaelement.js',
            'src/js/renderers/html5.js',
            'src/js/renderers/flash.js',
          ].concat(rendererSources || [
            'src/js/renderers/dash.js',
            'src/js/renderers/flv.js',
            'src/js/renderers/hls.js',
            'src/js/renderers/youtube.js',
          ]).concat([
            'src/js/player.js',
            'src/js/player/library.js',
            'src/js/player/default.js',
            'src/js/features/fullscreen.js',
            'src/js/features/playpause.js',
            'src/js/features/progress.js',
            'src/js/features/time.js',
            'src/js/features/tracks.js',
            'src/js/features/volume.js',
            //'src/js/features/i18n.js',
            //'src/js/languages/en.js',
          ]),

          // new renderers
          'build/renderers/dailymotion.js': 'src/js/renderers/dailymotion.js',
          'build/renderers/facebook.js': 'src/js/renderers/facebook.js',
          'build/renderers/soundcloud.js': 'src/js/renderers/soundcloud.js',
          'build/renderers/twitch.js': 'src/js/renderers/twitch.js',
          'build/renderers/youtube.js': 'src/js/renderers/youtube.js',
          'build/renderers/vimeo.js': 'src/js/renderers/vimeo.js'
        },
        options: {
          plugin: [
            'browserify-derequire', 'bundle-collapser/plugin'
          ]
        }
      }
    },

    concat: {
      dist: {
        options: {
          //banner: grunt.file.read('src/js/header.js')
        },
        expand: true,
        cwd: 'build/',
        src: ['**/*.js', '!lang/*.js', '!jquery.js', '!**/*.min.js'],
        ext: '.js',
        dest: 'build/'
      }
    },

    removelogging: {
      dist: {
        cwd: 'build/',
        src: ['**/*.js', '!lang/*.js', '!jquery.js', '!**/*.min.js'],
      },
      options: {
        // Keep `warn` and other methods from the console API
        methods: ['log']
      }
    },

    uglify: {
      options: {
        output: {
          comments: false
        },
        banner: grunt.file.read('src/js/header.js')
      },
      build: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**/*.js', '!lang/*.js', '!jquery.js', '!**/*.min.js'],
          dest: 'build/',
          ext: '.min.js'
        }]
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          cwd: 'src/skins/',
          expand: true,
          src: ['**/*.{gif,jpg,png,svg}'],
          dest: 'build/skins/'
        }]
      }
    },

    stylelint: {
      all: ['src/skins/**/*.css']
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/skins/',
          src: ['**/*.scss'],
          dest: 'src/skins/',
          ext: '.css'
        }]
      }
    },

    postcss: {
      options: {
        processors: [
          // Add vendor prefixes.
          require('autoprefixer')({
            browsers: 'last 3 versions'
          }),
          require('cssnano')()
        ]
      },
      default: {
        expand: true,
        flatten: false,
        cwd: 'src/skins/',
        src: ['**/*.css'],
        dest: 'build/skins/',
        ext: '.min.css'
      }
    }
  });

  grunt.registerTask('default', ['clean', 'sass', 'stylelint', 'postcss', 'imagemin', 'eslint', 'browserify', 'concat', 'removelogging', 'uglify', 'copy']);
  grunt.registerTask('debug', ['clean', 'sass', 'stylelint', 'eslint', 'browserify', 'concat', 'uglify']);
  grunt.registerTask('flash', '', function () {
    var exec = require('child_process').execSync;
    var result = exec("sh compile_swf.sh", {
      encoding: 'utf8'
    });
    grunt.log.writeln(result);
  });
};
