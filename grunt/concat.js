/**
 * @file
 * Configure grunt concat
 */

module.exports = {
  me: {
    src: [
      'src/js/me-header.js',
      'src/js/me-namespace.js',
      'src/js/me-utility.js',
      'src/js/me-plugindetector.js',
      'src/js/me-featuredetection.js',
      'src/js/me-mediaelements.js',
      'src/js/me-shim.js',
      'src/js/me-i18n.js',
        // Bug #1263
        //'src/js/me-i18n-locale-de.js',
        //'src/js/me-i18n-locale-zh.js'
    ],
    dest: 'local-build/mediaelement.js'
  },
  mep: {
    src: [
      'src/js/mep-header.js',
      'src/js/mep-library.js',
      'src/js/mep-player.js',
      'src/js/mep-feature-playpause.js',
      'src/js/mep-feature-stop.js',
      'src/js/mep-feature-progress.js',
      'src/js/mep-feature-time.js',
      'src/js/mep-feature-volume.js',
      'src/js/mep-feature-fullscreen.js',
      'src/js/mep-feature-speed.js',
      'src/js/mep-feature-tracks.js',
      'src/js/mep-feature-contextmenu.js',
      'src/js/mep-feature-postroll.js'
    ],
    dest: 'local-build/mediaelementplayer.js'
  },
  bundle: {
    src: [
      'local-build/mediaelement.js',
      'local-build/mediaelementplayer.js'
    ],
    dest: 'local-build/mediaelement-and-player.js'
  }
};
