import { AnimatePresence, motion } from "framer-motion";

export function LevelUpOverlay({ show, level, onClose }: { show: boolean; level: number; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center bg-background/70 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
            className="relative text-center"
          >
            <motion.div
              className="absolute inset-0 -z-10 rounded-full blur-3xl"
              style={{ background: "var(--gradient-aurora)" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan">Level Up</p>
            <h1 className="mt-3 font-display text-7xl md:text-9xl font-bold gradient-text">LV {level}</h1>
            <p className="mt-4 font-mono text-sm text-muted-foreground">Click anywhere to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
