const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input = "") => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        // Compile the C++ file
        const compile = spawn("g++", [filepath, "-o", outPath]);

        let compileError = "";
        compile.stderr.on("data", (data) => {
            compileError += data.toString();
        });

        compile.on("close", (code) => {
            if (code !== 0) {
                return reject({ error: "Compilation failed", stderr: compileError });
            }

           
            const run = spawn(path.join(outputPath, `${jobId}.exe`), [], { cwd: outputPath });

            let stdout = "";
            let stderr = "";

          
            const TIMEOUT = 2000;
            const timeoutId = setTimeout(() => {
                run.kill();
                reject({ error: "Time Limit Exceeded " });
            }, TIMEOUT);

            run.stdout.on("data", (data) => {
                stdout += data.toString();
            });

            run.stderr.on("data", (data) => {
                stderr += data.toString();
            });

            run.on("close", (code) => {
                clearTimeout(timeoutId);
                if (code !== 0) {
                    return reject({ error: "Execution failed", stderr });
                }
                resolve(stdout);
            });

            // Provide input to the program, if any
            if (input) {
                run.stdin.write(input);
            }
            run.stdin.end();
        });
    });
};

module.exports = {
    executeCpp,
};