module.exports = {
  appId: "pt.healthtech.arm",
  productName: "ARM - Apoio à Receita Médica",
  directories: {
    output: "dist"
  },
  files: [
    "build/**/*",
    "src/main.js",
    "src/preload.js",
    "src/data/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  extraResources: [
    {
      from: "src/data",
      to: "data"
    }
  ],
  mac: {
    category: "public.app-category.medical",
    icon: "src/assets/icon.icns",
    target: [
      {
        target: "dmg",
        arch: ["x64", "arm64"]
      }
    ]
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      }
    ],
    icon: "src/assets/icon.ico",
    publisherName: "HealthTech Portugal"
  },
  linux: {
    target: [
      {
        target: "AppImage",
        arch: ["x64"]
      }
    ],
    category: "Office",
    icon: "src/assets/icon.png"
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};