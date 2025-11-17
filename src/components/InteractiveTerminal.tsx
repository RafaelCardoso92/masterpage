"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  input: string;
  output: string[];
  delay?: number;
}

const commands: Command[] = [
  {
    input: "docker ps --format 'table {{.Names}}\t{{.Status}}'",
    output: [
      "NAMES                    STATUS",
      "traefik                  Up 45 days",
      "caseanalyser-backend     Up 45 days",
      "caseanalyser-frontend    Up 45 days",
      "immich                   Up 45 days",
      "postgres                 Up 45 days",
      "watchtower               Up 45 days",
      "uptime-kuma              Up 45 days",
    ],
  },
  {
    input: "df -h / | tail -1 | awk '{print $5}'",
    output: ["84% - Within optimal range ✓"],
  },
  {
    input: "cat /home/rafael/scripts/logs/health-check.log | tail -3",
    output: [
      "✓ All containers healthy",
      "✓ RAID 1 synchronized (100%)",
      "✓ System load: 0.45 (optimal)",
    ],
  },
  {
    input: "uptime -p",
    output: ["up 6 weeks, 3 days, 12 hours"],
  },
];

export const InteractiveTerminal = () => {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [history, setHistory] = useState<Array<{ input: string; output: string[] }>>([]);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-type command
  useEffect(() => {
    if (currentCommandIndex >= commands.length) return;

    const command = commands[currentCommandIndex];

    if (isTyping && currentInput.length < command.input.length) {
      const timeout = setTimeout(() => {
        setCurrentInput(command.input.slice(0, currentInput.length + 1));
      }, 50 + Math.random() * 50);
      return () => clearTimeout(timeout);
    } else if (isTyping && currentInput.length === command.input.length) {
      setIsTyping(false);
      const timeout = setTimeout(() => {
        setOutput(command.output);
        const timeout2 = setTimeout(() => {
          setHistory([...history, { input: currentInput, output: command.output }]);
          setCurrentInput("");
          setOutput([]);
          setCurrentCommandIndex(currentCommandIndex + 1);
          setIsTyping(true);
        }, 2000);
        return () => clearTimeout(timeout2);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentInput, currentCommandIndex, isTyping, history]);

  // Reset cycle
  useEffect(() => {
    if (currentCommandIndex >= commands.length) {
      const timeout = setTimeout(() => {
        setHistory([]);
        setCurrentCommandIndex(0);
        setCurrentInput("");
        setOutput([]);
        setIsTyping(true);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [currentCommandIndex]);

  return (
    <div className="w-full font-mono text-sm bg-dark-200/90 rounded-lg border border-white/10 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-dark-100/50 px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-light-100 text-xs">rafael@home-server:~</span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 h-96 overflow-y-auto">
        {/* Command History */}
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center gap-2 text-green-400">
              <span>$</span>
              <span>{item.input}</span>
            </div>
            <div className="mt-1 text-light-100 pl-4">
              {item.output.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}

        {/* Current Command */}
        {currentCommandIndex < commands.length && (
          <div>
            <div className="flex items-center gap-2 text-green-400">
              <span>$</span>
              <span>{currentInput}</span>
              {cursorVisible && isTyping && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block w-2 h-4 bg-green-400"
                />
              )}
            </div>
            <AnimatePresence>
              {output.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 text-light-100 pl-4"
                >
                  {output.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Completion Message */}
        {currentCommandIndex >= commands.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-accent text-center py-4"
          >
            ✨ All systems operational. Restarting demo...
          </motion.div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="bg-dark-100/50 px-4 py-2 border-t border-white/10 text-xs text-light-100/60 flex justify-between">
        <span>Live Production Server</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Connected
        </span>
      </div>
    </div>
  );
};
