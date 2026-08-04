const builder = require("electron-builder");

async function pack() {
  console.log("📦 Packaging VersoLyn Windows Desktop App...");

  await builder.build({
    config: {
      appId: "com.versolyn.app",
      productName: "VersoLyn",
      copyright: "Copyright © 2025 VersoLyn",
      asar: false,
      compression: "normal",
      icon: "build/icon.ico",
      directories: {
        buildResources: "build",
        output: "release",
      },
      files: [
        "dist-electron/**/*",
        "package.json",
      ],
      extraResources: [
        {
          from: "new-logo",
          to: "new-logo",
          filter: ["**/*.png"],
        },
      ],
      win: {
        target: "nsis",
        executableName: "VersoLyn",
        icon: "build/icon.ico",
        forceCodeSigning: false,
        sign: async () => {}, // Bypass signtool on Windows
      },
      nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        allowElevation: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: "VersoLyn",
        installerIcon: "build/icon.ico",
        uninstallerIcon: "build/icon.ico",
        installerHeaderIcon: "build/icon.ico",
        deleteAppDataOnUninstall: false,
        displayLanguageSelector: false,
        installerLanguages: ["English"],
        license: "build/LICENSE.txt",
        multiLanguageInstaller: false,
        runAfterFinish: true,
        menuCategory: "VersoLyn",
      },
    },
  });

  console.log("✅ VersoLyn Windows Installer built successfully!");
}

pack().catch((err) => {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
});
