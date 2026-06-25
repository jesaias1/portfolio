export type CommerceMode =
  | "free"
  | "free-with-donation"
  | "pay-what-you-want"
  | "one-time-purchase"
  | "demo-plus-full";

export type AudioProduct = {
  slug: "midium" | "abyx";
  name: string;
  kicker: string;
  headline: string;
  shortCopy: string;
  longCopy: string;
  accent: string;
  accentSoft: string;
  identity: "fluid" | "physical";
  labels: string[];
  assets: {
    screenshot: string;
    video: string | string[];
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
    "Independent Windows music software for drawing, performing and discovering new ideas.",
  origin: "Copenhagen, Denmark",
  urls: {
    home: "/audio",
    portfolio: "https://jesaias.dk",
    instagram: "#instagram",
    youtube: "#youtube",
    support: "#support",
    contact: "mailto:contact@jesaias.dk",
    terms: "#terms",
    privacy: "#privacy",
    donation: "#support-development",
  },
};

export const audioProducts: AudioProduct[] = [
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
    labels: ["VST3", "STANDALONE", "WINDOWS ONLY", "$10", "30-DAY TRIAL"],
    assets: {
      screenshot: "/audio/products/midium-screenshot.png",
      video: "/projects/videos/midium.mp4",
    },
    urls: {
      download: "https://jesaias.lemonsqueezy.com/checkout/buy/cf61954c-2b62-4161-a08f-2d6f96f549e5",
      buyLicense: "https://jesaias.lemonsqueezy.com/checkout/buy/5b2c568d-8e84-4b1e-873f-bb093aea0463",
      watch: "#midium-video",
      resource: "/audio/midium",
      support: "#support",
      donation: "#support-development",
    },
    commerce: {
      mode: "demo-plus-full",
      statusLabel: "30-day trial",
      priceLabel: "$10 license key",
      trialLabel: "Download Free 30-Day Trial",
      trialNote:
        "Free to try for 30 days, then enter a license key to keep using it. One $10 purchase unlocks MIDIUM standalone + VST3 for Windows.",
    },
    currentVersion: {
      version: "0.1.0 beta",
      date: "2026-06-17",
      notes: [
        "Windows beta package prepared with standalone app and VST3 plugin.",
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
      "Windows only for now",
      "VST3 compatible hosts",
      "Standalone application",
      "MIDI export for DAW workflows",
    ],
    installation: [
      "Download the free 30-day Windows trial package from Lemon Squeezy.",
      "Run MIDIUM.exe for the standalone app or copy MIDIUM.vst3 to your VST3 plugin folder.",
      "Rescan plugins in your DAW, then open MIDIUM as an instrument.",
      "After the trial, enter your license key to keep using MIDIUM standalone and VST3.",
    ],
    betaLimitations: [
      "Windows builds are the only current release target.",
      "Preset and host compatibility may change during beta.",
      "The license flow is being introduced during the public Windows beta.",
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
    labels: ["VST3", "STANDALONE", "WINDOWS ONLY", "XBOX", "PLAYSTATION", "$10", "30-DAY TRIAL"],
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
      support: "#support",
      donation: "#support-development",
    },
    commerce: {
      mode: "demo-plus-full",
      statusLabel: "30-day trial",
      priceLabel: "$10 license key",
      trialLabel: "Download Free 30-Day Trial",
      trialNote:
        "Free to try for 30 days, then enter a license key to keep using it. One $10 purchase unlocks ABYX standalone + VST3 for Windows.",
    },
    currentVersion: {
      version: "1.0.0 beta",
      date: "2026-06-17",
      notes: [
        "Windows beta package prepared with standalone app and VST3 plugin.",
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
      "Windows only for now",
      "VST3 compatible hosts",
      "Standalone application",
      "Xbox and PlayStation style controllers",
    ],
    installation: [
      "Download the free 30-day Windows trial package from Lemon Squeezy.",
      "Connect a supported controller before launching ABYX.",
      "Run ABYX.exe for the standalone app or copy ABYX.vst3 to your VST3 plugin folder.",
      "After the trial, enter your license key to keep using ABYX standalone and VST3.",
    ],
    betaLimitations: [
      "Controller detection can vary by driver and connection type.",
      "Windows builds are the only current release target; Mac builds are not available yet.",
      "The license flow is being introduced during the public Windows beta.",
    ],
  },
];

export const getAudioProduct = (slug: string) =>
  audioProducts.find((product) => product.slug === slug);
