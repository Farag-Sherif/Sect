import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const 
    } 
  }
};

export const StaggerContainer = forwardRef<HTMLDivElement, { children: ReactNode, className?: string, delay?: number }>(({ children, className = '', delay = 0 }, ref) => {
  const variants = delay ? {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      }
    }
  } : containerVariants;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      ref={ref}
    >
      {children}
    </motion.div>
  );
});

export function StaggerItem({ children, className = '', onClick }: { children: ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.div variants={itemVariants} className={className} onClick={onClick}>
      {children}
    </motion.div>
  );
}
