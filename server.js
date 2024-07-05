const { spawn } = require("child_process");
const fs = require("fs");
const app = require("./app");
const chokidar = require("chokidar");
const path = require("path");

if (!process.argv[2]) throw new Error("Atleast pass a valid name, dude");
const dirName = path.dirname(process.argv[2]);
const fileName = path.basename(process.argv[2]);

const exclude = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.nyc_output/**",
  "**/coverage/**",
  "**/.sass-cache/**",
  "**/bower_components/**",
  "**/.log",
  "**/.DS_Store",
  "**/.pid",
  "**/.seed",
  "**/.pid.lock",
  "**/.swp",
  "**/.swo",
  "**/.swn",
  "**/.swo",
  "**/.swp",
  "**/.bak",
  "**/.tmp",
  "**/*.ts",
  "**/*.map",
  "**/*.coffee",
  "**/*.litcoffee",
  "**/*.css.map",
  "**/*.sass.map",
  "**/*.scss.map",
  "**/*.less.map",
  "**/*.styl.map",
  "**/*.jsx",
  "**/*.es",
  "**/*.es6",
  "**/*.mjs",
];

const watcher = chokidar.watch(dirName, {
  ignored: exclude,
  // usePolling: true,
});

const kill = (killMessage) => {
  console.error(killMessage);
  watcher.close();
  process.exit(1);
};

if (!fs.existsSync(process.argv[2]))
  kill(
    "Dude, you should atleast know what you are doing. \nPS: pass a valid file name, dude."
  );

let serverProcess;

const startServer = () => {
  if (serverProcess) {
    serverProcess.kill();
    console.log("Killed previous child process");
  }

  serverProcess = spawn("node", [process.argv[2]]);
  serverProcess.on("close", (code) => {
    if (code !== null) {
      console.log(`child process exited with code ${code}`);
    }
  });
};

watcher.on("ready", () => {
  console.log("Started promon successfully...");
  startServer();

  watcher.on("add", (path) => {
    console.log("Added " + path);
    startServer();
  });

  watcher.on("unlink", (path) => {
    console.log("Deleted " + path);
    startServer();
  });

  watcher.on("change", (path) => {
    console.log("Changed " + path);
    startServer();
  });
});

watcher.on("error", (err) => {
  console.error(`Watcher error: ${err.message}`);
});
