'use strict';

// default player values
export const config = {
  // url to poster (to fix iOS 3.x)
  poster: '',
  // When the video is ended, show the poster.
  showPosterWhenEnded: false,
  // When the video is paused, show the poster.
  showPosterWhenPaused: false,
  // Default if the <video width> is not specified
  defaultVideoWidth: 480,
  // Default if the <video height> is not specified
  defaultVideoHeight: 270,
  // If set, overrides <video width>
  videoWidth: -1,
  // If set, overrides <video height>
  videoHeight: -1,
  // Default if the user doesn't specify
  defaultAudioWidth: 400,
  // Default if the user doesn't specify
  defaultAudioHeight: 40,
  // Default amount to move back when back key is pressed
  defaultSeekBackwardInterval: (media) => media.getDuration() * 0.05,
  // Default amount to move forward when forward key is pressed
  defaultSeekForwardInterval: (media) => media.getDuration() * 0.05,
  // Set dimensions via JS instead of CSS
  setDimensions: true,
  // Width of audio player
  audioWidth: -1,
  // Height of audio player
  audioHeight: -1,
  // Useful for <audio> player loops
  loop: false,
  // Rewind to beginning when media ends
  autoRewind: true,
  // Resize to media dimensions
  enableAutosize: true,
  /*
   * Time format to use. Default: 'mm:ss'
   * Supported units:
   *   h: hour
   *   m: minute
   *   s: second
   *   f: frame count
   * When using 'hh', 'mm', 'ss' or 'ff' we always display 2 digits.
   * If you use 'h', 'm', 's' or 'f' we display 1 digit if possible.
   *
   * Example to display 75 seconds:
   * Format 'mm:ss': 01:15
   * Format 'm:ss': 1:15
   * Format 'm:s': 1:15
   */
  timeFormat: '',
  // Force the hour marker (##:00:00)
  alwaysShowHours: false,
  // Show framecount in timecode (##:00:00:00)
  showTimecodeFrameCount: false,
  // Used when showTimecodeFrameCount is set to true
  framesPerSecond: 25,
  // Hide controls when playing and mouse is not over the video
  alwaysShowControls: false,
  // Display the video control when media is loading
  hideVideoControlsOnLoad: false,
  // Display the video controls when media is paused
  hideVideoControlsOnPause: false,
  // Enable click video element to toggle play/pause
  clickToPlayPause: true,
  // Time in ms to hide controls
  controlsTimeoutDefault: 1500,
  // Time in ms to trigger the timer when mouse moves
  controlsTimeoutMouseEnter: 2500,
  // Time in ms to trigger the timer when mouse leaves
  controlsTimeoutMouseLeave: 1000,
  // Force iPad's native controls
  iPadUseNativeControls: false,
  // Force iPhone's native controls
  iPhoneUseNativeControls: false,
  // Force Android's native controls
  AndroidUseNativeControls: false,
  // Features to show
  features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
  // 
  featureText: {
    play: "Play",
    pause: "Pause",
    current: "Current",
    progress: "Progress",
    duration: "Duration",
    tracks: "Tracks",
    volumeSlider: "Volume Control",
    mute: "Mute",
    unmute: "Unmute",
    fullscreen: "Fullscreen",
    downloadFile: "Download File",
    flashRequired: "You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https://get.adobe.com/flashplayer/",
    timeSlider: "Play Time",
    timeHelpText: "Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.",
    liveBroadcast: "Live Broadcast",
    volumeHelpText: "Use Up/Down Arrow keys to increase or decrease volume.",
    videoPlayer: "Video Player",
    audioPlayer: "Audio Player",
    captionsSubtitles: 'Captions/Subtitles',
    captionsChapters: 'Chapters',
	none: "None",
	languages: []
  },
  // If set to `true`, all the default control elements listed in features above will be used, and the features will
  // add other features
  useDefaultControls: false,
  // Only for dynamic
  isVideo: true,
  // Stretching modes (auto, fill, responsive, none)
  stretching: 'auto',
  // Prefix class names on elements
  classPrefix: 'mejs__',
  // Turn keyboard support on and off for this instance
  enableKeyboard: true,
  // When this player starts, it will pause other players
  pauseOtherPlayers: true,
  // Number of decimal places to show if frames are shown
  secondsDecimalLength: 0,
  // If error happens, set up HTML message via string or function
  customError: null,
  // Array of keyboard actions such as play/pause
  keyActions: [{
    keys: [
      32, // SPACEBAR
      179 // GOOGLE play/pause button
    ],
    action: (player) => {

      if (!IS_FIREFOX) {
        if (player.paused || player.ended) {
          player.play();
        } else {
          player.pause();
        }
      }
    }
  }]
};

export default config;
