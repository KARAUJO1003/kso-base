/**
 * Input handling utilities for interactive and piped modes
 * @module input-handler
 */

import fs from "node:fs";
import readline from "node:readline";

// Check if input is from TTY or piped
const isTTY = process.stdin.isTTY;
let pipedLines = [];
let lineIndex = 0;
let rl = null;

/**
 * Initialize input handler (reads piped input if available)
 */
function initializeInputHandler() {
  if (!isTTY) {
    const data = fs.readFileSync(0, "utf-8");
    pipedLines = data.split("\n").map((l) => l.trim());
  } else {
    rl = readline.createInterface({ 
      input: process.stdin, 
      output: process.stdout 
    });
  }
}

/**
 * Ask a question and get user input (supports TTY and piped modes)
 * @param {string} question - Question to display to user
 * @returns {Promise<string>} User's answer
 */
export function ask(question) {
  // Lazy initialization
  if (!isTTY && pipedLines.length === 0 && lineIndex === 0) {
    initializeInputHandler();
  }
  if (isTTY && !rl) {
    initializeInputHandler();
  }

  if (!isTTY) {
    const answer = pipedLines[lineIndex++] || "";
    console.log(question + answer);
    return Promise.resolve(answer);
  }

  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

/**
 * Close the readline interface (call at the end of script)
 */
export function closeInput() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

/**
 * Check if input is from TTY (terminal) or piped
 * @returns {boolean} True if TTY, false if piped
 */
export function isInteractive() {
  return isTTY;
}
