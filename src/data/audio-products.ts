export type CommerceMode =
  | "free"
  | "free-with-donation"
  | "pay-what-you-want"
  | "one-time-purchase"
  | "demo-plus-full"
  | "coming-soon";

export type AudioProduct = {
  slug: "orvo" | "midium" | "abyx";
  name: string;
  kicker: string;
  headline: string;
  shortCopy: string;
  longCopy: string;
  accent: string;
  accentSoft: string;
  identity: "fluid" | "physical" | "transformative";
  labels: string[];
  assets: {
    screenshot: string;
    video?: string | string[];
    logo?: string;
  };
  urls: {
    download: string;
    buyLicense?: string;
    watch: string;
    resource: string;
    support: string;
    donation: string;
  };
  commerce: {
    mode: CommerceMode;
    statusLabel: string;
    priceLabel: string;
    trialLabel?: string;
    trialNote?: string;
  };
  currentVersion: {
    version: string;
    date: string;
    notes: string[];
  };
  workflow: {
    title: string;
    text: string;
  }[];
  features: string[];
  compatibility: string[];
  installation: string[];
  betaLimitations: string[];
};

export const audioSite = {
  brand: "JESAIAS AUDIO",
  tagline: "Tools that make music feel playable.",
  description:
    "Independent music software for drawing, performing and discovering new ideas.",
  origin: "Copenhagen, Denmark",
  urls: {
    home: "/audio",
    portfolio: "https://jesaias.dk",
    instagram: "https://www.instagram.com/linasjesaias/",
    support: "/audio#support",
    contact: "mailto:linasjesaias@gmail.com",
    donation: "/audio#support",
  },
};

export const audioProducts: AudioProduct[] = [
  {
    slug: "orvo",
    name: "ORVO",
    kicker: "Sample transformation instrument",
    headline: "Stretch sound until it becomes something else.",
    shortCopy:
      "ORVO turns a single sample into evolving clouds, elastic rhythms, tape movement and granular textures through a tactile performance interface.",
    longCopy:
      "Load a sound, choose a transformation engine and shape it with PULSE sequencing, drawn motion, four LFOs, macros and a complete effects rack. ORVO is designed for the moment a familiar sample needs to become an entirely new instrument.",
    accent: "#77c8ff",
    accentSoft: "rgba(119, 200, 255, 0.16)",
    identity: "transformative",
    labels: ["VST3", "C++20", "JUCE 8", "IN DEVELOPMENT"],
    assets: {
      screenshot: "/projects/orvo-mockup.png",
      video: "/projects/videos/orvo-teaser.mp4",
    },
    urls: {
      download: "#orvo-preview",
      watch: "#orvo-video",
      resource: "/audio/orvo",
      support: "/audio#support",
      donation: "/audio#support",
    },
    commerce: {
      mode: "coming-soon",
      statusLabel: "Development preview",
      priceLabel: "Release details coming later",
      trialNote:
        "ORVO is currently being refined. The page is ready for product recordings, release information and download links when the instrument is ready to share.",
    },
    currentVersion: {
      version: "Development build",
      date: "2026-08-02",
      notes: [
        "Four transformation engines: Cloud, Elastic, Tape and Grain.",
        "PULSE gate sequencer with drawn modulation and four LFOs.",
        "Macro controls and a complete filter, drive, delay and reverb chain.",
      ],
    },
    workflow: [
      {
        title: "Load",
        text: "Bring in any sample and define the playable region.",
      },
      {
        title: "Transform",
        text: "Move between stretching, tape, cloud and granular engines.",
      },
      {
        title: "Perform",
        text: "Animate the result with PULSE, LFOs, macros and effects.",
      },
    ],
    features: [
      "Cloud, Elastic, Tape and Grain transformation engines",
      "Tempo-synced PULSE gate and motion sequencer",
      "Four LFOs with flexible modulation routing",
      "Melt, Pulse, Drift and Space performance macros",
      "Filter, drive, delay and reverb effects rack",
      "Rendered audio workflow for returning transformed sound to the DAW",
    ],
    compatibility: [
      "VST3 compatible hosts",
      "Built with C++20 and JUCE 8",
      "Desktop release targets will be confirmed before launch",
    ],
    installation: [
      "Public installation instructions will be added with the first release.",
      "The finished page is prepared for a download package and versioned release notes.",
    ],
    betaLimitations: [
      "ORVO is not publicly downloadable yet.",
      "Final compatibility and system requirements are still being tested.",
      "Interface recordings and audio examples will be added before launch.",
    ],
  },
  {
    slug: "midium",
    name: "MIDIUM",
    kicker: "Visual MIDI instrument",
    headline: "Draw MIDI. Shape ideas directly.",
    shortCopy:
      "MIDIUM is a visual MIDI instrument that lets you create melodies, basslines, drums and patterns by drawing them instead of placing every note individually.",
    longCopy:
      "Draw pitch, rhythm and velocity as a gesture, then refine the result with scale locking, quantization and export tools built for fast DAW work.",
    accent: "#00d9ff",
    accentSoft: "rgba(0, 217, 255, 0.18)",
    identity: "fluid",
    labels: ["VST3", "WINDOWS STANDALONE", "$10", "30-DAY TRIAL"],
    assets: {
      screenshot: "/audio/products/midium-screenshot.png",
      video: "/projects/videos/midium.mp4",
    },
    urls: {
      download: "https://jesaias.lemonsqueezy.com/checkout/buy/cf61954c-2b62-4161-a08f-2d6f96f549e5",
      buyLicense: "https://jesaias.lemonsqueezy.com/checkout/buy/5b2c568d-8e84-4b1e-873f-bb093aea0463",
      watch: "#midium-video",
      resource: "/audio/midium",
      support: "/audio#support",
      donation: "/audio#support",
    },
    commerce: {
      mode: "demo-plus-full",
      statusLabel: "30-day trial",
      priceLabel: "$10 license key",
      trialLabel: "Download Free 30-Day Trial",
      trialNote:
        "Free to try for 30 days, then enter a license key to keep using it. One $10 purchase unlocks MIDIUM VST3 for compatible DAWs plus the Windows standalone app.",
    },
    currentVersion: {
      version: "0.1.0 beta",
      date: "2026-06-17",
      notes: [
        "Beta package prepared with VST3 plugin and Windows standalone app.",
        "Drawing workflow for pitch, rhythm and velocity.",
        "Scale locking, quantize values and MIDI export.",
      ],
    },
    workflow: [
      {
        title: "Draw",
        text: "Sketch rhythm, pitch and velocity directly.",
      },
      {
        title: "Shape",
        text: "Quantize, scale-lock and refine the result.",
      },
      {
        title: "Export",
        text: "Drag the finished MIDI into your DAW.",
      },
    ],
    features: [
      "Gesture-based MIDI generation",
      "Melodies, basslines, drum patterns and utility sketches",
      "Scale locking and quantization",
      "Velocity drawing and pattern length controls",
      "MIDI drag-and-drop/export workflow",
    ],
    compatibility: [
      "VST3 compatible hosts",
      "Windows standalone application",
      "MIDI export for DAW workflows",
    ],
    installation: [
      "Download the free 30-day trial package from Lemon Squeezy.",
      "Run MIDIUM.exe for the Windows standalone app or copy MIDIUM.vst3 to your DAW's VST3 plugin folder.",
      "Rescan plugins in your DAW, then open MIDIUM as an instrument.",
      "After the trial, enter your license key to keep using MIDIUM standalone and VST3.",
    ],
    betaLimitations: [
      "The standalone app is Windows-only for now.",
      "Preset and host compatibility may change during beta.",
      "The license flow is being introduced during the public beta.",
    ],
  },
  {
    slug: "abyx",
    name: "ABYX",
    kicker: "Gamepad music instrument",
    headline: "Your controller is now a musical instrument.",
    shortCopy:
      "Assign sounds, instruments and effects to a gamepad. Perform beats, manipulate parameters and discover a different way to interact with your DAW.",
    longCopy:
      "ABYX turns Xbox and PlayStation controllers into performance hardware, mapping buttons and analog sticks to sounds, samples, effects and DAW gestures.",
    accent: "#f0f0ec",
    accentSoft: "rgba(240, 240, 236, 0.14)",
    identity: "physical",
    labels: ["VST3", "WINDOWS STANDALONE", "XBOX", "PLAYSTATION", "$10", "30-DAY TRIAL"],
    assets: {
      screenshot: "/audio/products/abyx-screenshot.png",
      video: ["/audio/products/abyx-ad.mp4", "/projects/videos/abyx.mp4"],
      logo: "/audio/products/abyx-logo.png",
    },
    urls: {
      download: "https://jesaias.lemonsqueezy.com/checkout/buy/4b3e9cd5-e5ef-44d4-821f-0beb83df4b48",
      buyLicense: "https://jesaias.lemonsqueezy.com/checkout/buy/58bd7308-585b-4de2-a446-d596288d7298",
      watch: "#abyx-video",
      resource: "/audio/abyx",
      support: "/audio#support",
      donation: "/audio#support",
    },
    commerce: {
      mode: "demo-plus-full",
      statusLabel: "30-day trial",
      priceLabel: "$10 license key",
      trialLabel: "Download Free 30-Day Trial",
      trialNote:
        "Free to try for 30 days, then enter a license key to keep using it. One $10 purchase unlocks ABYX VST3 for compatible DAWs plus the Windows standalone app.",
    },
    currentVersion: {
      version: "1.0.0 beta",
      date: "2026-06-17",
      notes: [
        "Beta package prepared with VST3 plugin and Windows standalone app.",
        "Controller layout view with live input feedback.",
        "Button, trigger and analog-stick mapping for musical controls.",
      ],
    },
    workflow: [
      {
        title: "Map",
        text: "Assign sounds and functions to controller input.",
      },
      {
        title: "Perform",
        text: "Play beats and manipulate effects physically.",
      },
      {
        title: "Record",
        text: "Capture controller performances inside the workflow.",
      },
    ],
    features: [
      "Xbox and PlayStation controller input",
      "Button-to-sample and button-to-instrument assignment",
      "Analog sticks mapped to effects and parameters",
      "Live visual feedback from physical controller movement",
      "Performance capture for DAW-centered workflows",
    ],
    compatibility: [
      "VST3 compatible hosts",
      "Windows standalone application",
      "Xbox and PlayStation style controllers",
    ],
    installation: [
      "Download the free 30-day trial package from Lemon Squeezy.",
      "Connect a supported controller before launching ABYX.",
      "Run ABYX.exe for the Windows standalone app or copy ABYX.vst3 to your DAW's VST3 plugin folder.",
      "After the trial, enter your license key to keep using ABYX standalone and VST3.",
    ],
    betaLimitations: [
      "Controller detection can vary by driver and connection type.",
      "The standalone app is Windows-only for now.",
      "The license flow is being introduced during the public beta.",
    ],
  },
];

export const getAudioProduct = (slug: string) =>
  audioProducts.find((product) => product.slug === slug);
