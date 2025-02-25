import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  words: string[];
  baseText: string;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  baseText,
  className = "",
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const word = words[currentWordIndex];
    const typingSpeed = isDeleting ? 100 : 200; // Slower typing speed

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < word.length) {
          setText(word.slice(0, text.length + 1));
        } else {
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(true);
          }, 2500); // Longer pause when word is complete
        }
      } else {
        if (text.length > 0) {
          setText(word.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, currentWordIndex, words, isWaiting]);

  return (
    <span className={className}>
      {baseText}{" "}
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block min-w-[180px] border-b-2 border-primary pb-1"
        >
          {text}
          {!isWaiting && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="ml-1"
            >
              |
            </motion.span>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default TypewriterText;
