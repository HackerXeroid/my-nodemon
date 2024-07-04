const { exec } = require("child_process");
const fs = require("fs");
const app = require("./app");
const chokidar = require("chokidar");

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
const watcher = chokidar.watch(__dirname, {
  ignored: exclude,
  // usePolling: true,
});

const kill = (killMessage) => {
  console.error(killMessage);
  watcher.close();
  process.exit(1);
};

if (process.argv.length < 3)
  kill("You starting promon, man; at least pass a fileName!");

const restart = () => {
  console.log("Killing c");
  exec(
    `cd ${__dirname}; node server.js ${process.argv[2]} & echo "Executed"`,
    (err, stdout, stderr) => {
      if (err) return console.error(`Execution error: ${err}`);

      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  );
};

watcher.on("ready", () => {
  console.log("Started promon successfully...");

  watcher.on("add", (path) => {
    console.log("Added " + path);
    restart();
  });

  watcher.on("unlink", (path) => {
    console.log("Deleted " + path);
    restart();
  });

  watcher.on("change", (path) => {
    console.log("Changed " + path);
    restart();
  });
});
