const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const TIMEOUT = 2000; // 2 seconds

const executeCode = (language, filepath, input = "") => {
    return new Promise((resolve, reject) => {
        let compile, run, stdout = "", stderr = "";

        const jobId = path.basename(filepath).split(".")[0];

        if (language === "cpp") {
            const outPath = path.join(outputPath, `${jobId}.exe`);
            // Compile C++
            compile = spawn("g++", [filepath, "-o", outPath]);
            let compileError = "";
            compile.stderr.on("data", (data) => compileError += data.toString());
            compile.on("close", (code) => {
                if (code !== 0) {
                    return reject({ error: "Compilation failed", stderr: compileError });
                }
                // Run exe
                run = spawn(outPath, [], { cwd: outputPath });
                handleRun(run, resolve, reject, input);
            });
        } else if (language === "java") {
            // Java file: Class name must match file name!
            const originalPath = filepath;
            const mainJavaPath = path.join(outputPath, "Main.java");
            const className = "Main";

            // Move/rename the file to Main.java
            fs.renameSync(originalPath, mainJavaPath);

            let compileError = "";
            compile = spawn("javac", ["Main.java", "-d", outputPath], { cwd: outputPath });
            compile.stderr.on("data", (data) => compileError += data.toString());
            compile.on("close", (code) => {
                const restoreFile = () => {
                    // Restore file to original name
                    if (fs.existsSync(mainJavaPath)) {
                        fs.renameSync(mainJavaPath, originalPath);
                    }
                };

                if (code !== 0) {
                    restoreFile();
                    return reject({ error: "Compilation failed", stderr: compileError });
                }

                // Run java class
                run = spawn("java", ["-cp", outputPath, className], { cwd: outputPath });

                let outputCollected = false;
                handleRun(run, 
                    (data) => {
                        outputCollected = true;
                        restoreFile();
                        resolve(data);
                    },
                    (err) => {
                        outputCollected = true;
                        restoreFile();
                        reject(err);
                    },
                    input
                );

                // Safety: restore file if process is killed or fails unexpectedly
                run.on("exit", () => {
                    if (!outputCollected) restoreFile();
                });
            });
        } else if (language === "python") {
            // Run python script
            run = spawn("python3", [filepath], { cwd: outputPath });
            handleRun(run, resolve, reject, input);
        } else {
            reject({ error: "Unsupported language" });
        }
    });
};

// Helper for common run logic (with timeout and input)
function handleRun(run, resolve, reject, input) {
    let stdout = "", stderr = "";
    const timeoutId = setTimeout(() => {
        run.kill();
        reject({ error: "Time Limit Exceeded" });
    }, TIMEOUT);

    run.stdout.on("data", (data) => stdout += data.toString());
    run.stderr.on("data", (data) => stderr += data.toString());

    run.on("close", (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
            return reject({ error: "Execution failed", stderr });
        }
        resolve(stdout);
    });

    if (input) run.stdin.write(input);
    run.stdin.end();
}

module.exports = {
    executeCode,
};