/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate, useInView, useSpring, useReducedMotion } from 'motion/react';
import { 
  Camera, 
  Video, 
  Film, 
  Scissors, 
  Palette, 
  Smartphone, 
  PenTool,
  ArrowUpRight, 
  Plus, 
  Play, 
  Instagram, 
  Youtube, 
  Facebook,
  MessageCircle, 
  Menu, 
  X 
} from 'lucide-react';
import ScriptsPage from './components/ScriptsPage';

// --- Hooks ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

// --- Components ---

const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const OFFSET = 24;
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX + OFFSET);
      cursorY.set(e.clientY + OFFSET);
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, input, [role="button"]');
      setIsHovering(!!isInteractive);
    };
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <div className="film-grain" />
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-brand-orange rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          scale: isPressed ? 0.8 : isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "#FFFFFF" : "#FF9F1C",
          borderRadius: isHovering ? "20%" : "50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          translateX: springX,
          translateY: springY,
          x: '-50%',
          y: '-50%',
        }}
      />
      {/* Subtle Trail Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-orange/30 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{
          translateX: useSpring(cursorX, { damping: 40, stiffness: 200 }),
          translateY: useSpring(cursorY, { damping: 40, stiffness: 200 }),
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  );
};

const Magnetic = ({ children, className }: { children: React.ReactNode, className?: string, key?: React.Key }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ScrambleText = ({ text }: { text: string }) => {
  return (
    <span className="inline-block">
      {text}
    </span>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string, key?: React.Key }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(hover: none)").matches || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Counter = ({ value, duration = 2, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration, ease: "easeOut" });
    }
  }, [isInView, count, value, duration]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const Reveal = ({ children, delay = 0, width = "auto", className = "", fullHeight = false }: { children: React.ReactNode, delay?: number, width?: "auto" | "100%", className?: string, key?: React.Key, fullHeight?: boolean }) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const isInView = useInView(ref, { once: true, margin: isMobile ? "-10px" : "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className={className} style={{ position: "relative", width, overflow: fullHeight ? "visible" : "hidden", height: fullHeight ? "100%" : "auto" }}>
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
        transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: prefersReducedMotion ? 0 : (isMobile ? delay * 0.5 : delay), ease: [0.19, 1, 0.22, 1] }}
        className={fullHeight ? "h-full" : ""}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ShutterTransition = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 2.5, ease: [0.19, 1, 0.22, 1] }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[95] bg-brand-bg flex flex-col items-center justify-center pointer-events-none"
    >
      <motion.div
        key="aadarsh-sah"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black text-center">
          Aadarsh <span className="text-brand-orange">Sah</span>
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.0, duration: 1.5 }}
          className="h-[1px] bg-black/10 mt-4 max-w-[200px]"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.0 }}
          className="mt-4 text-[10px] uppercase tracking-[0.8em] font-black text-black/30"
        >
          Virtual Artist
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const words = ["VISION", "EXECUTION", "IMPACT"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length - 1) {
      const timeout = setTimeout(() => setIndex(index + 1), 1400);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(onComplete, 1400);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete, words.length]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="relative"
          >
            {/* Main Text */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-8xl font-black text-white tracking-tighter"
            >
              {words[index]}
            </motion.h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar (Minimal) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/10 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / words.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full bg-brand-orange"
        />
      </div>
    </motion.div>
  );
};

const BackgroundEffects = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 25;
      const moveY = (clientY - window.innerHeight / 2) / 25;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />
      
      {/* Floating Glass Cards for Depth */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="absolute top-[20%] left-[15%] w-64 h-64 border border-white/40 bg-white/20 rounded-3xl rotate-12 z-0 shadow-2xl shadow-black/5 hidden md:block" 
      />
      <motion.div 
        style={{ x: useTransform(springX, (v) => -v * 1.5), y: useTransform(springY, (v) => -v * 1.5) }}
        className="absolute bottom-[20%] right-[10%] w-96 h-96 border border-white/40 bg-white/10 rounded-[4rem] -rotate-6 z-0 shadow-2xl shadow-black/5 hidden md:block" 
      />
      
      {/* Persistent Film Grain */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Videos', href: '#videos' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/40 backdrop-blur-xl py-4 shadow-xl shadow-black/5 border-b border-white/20' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.a 
          href="#home" 
          whileHover="hover"
          className="text-2xl font-black tracking-tighter flex items-center gap-1"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center overflow-hidden">
            <motion.div 
              variants={{
                hover: { 
                  borderRadius: "20%",
                  rotate: 45,
                  scale: 1.2
                }
              }}
              className="w-4 h-4 bg-brand-orange rounded-full" 
            />
          </div>
          <span>Aadarsh Sah</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-black uppercase tracking-widest hover:text-brand-orange transition-colors py-2"
            >
              <ScrambleText text={link.name} />
            </a>
          ))}
          <Magnetic>
            <motion.a 
              href="https://wa.me/9779709026078?text=I%20want%20to%20hire%20you"
              target="_blank"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#FF9F1C", 
                color: "#000",
                boxShadow: "0 10px 30px -10px rgba(255, 159, 28, 0.5)"
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-4 py-2 rounded-full shadow-lg shadow-black/10 cursor-pointer transition-all duration-300"
            >
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              Available for hire
            </motion.a>
          </Magnetic>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ clipPath: "circle(0% at 100% 0%)", opacity: 0 }}
            animate={{ clipPath: "circle(150% at 100% 0%)", opacity: 1 }}
            exit={{ clipPath: "circle(0% at 100% 0%)", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="absolute top-full left-0 w-full h-screen bg-white/90 backdrop-blur-2xl border-b border-white/20 p-8 md:hidden flex flex-col gap-8 shadow-2xl z-50"
          >
            {navLinks.map((link, i) => (
              <motion.a 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                key={link.name} 
                href={link.href} 
                className="text-4xl font-black uppercase tracking-tighter hover:text-brand-orange transition-colors py-4 block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest bg-black text-white px-6 py-4 rounded-full shadow-lg shadow-black/10 justify-center">
                <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                Available for hire
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const y1 = useTransform(scrollY, [0, 500], [0, isMobile || prefersReducedMotion ? 0 : 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, isMobile || prefersReducedMotion ? 0 : -100]);
  const rotate = useTransform(scrollY, [0, 500], [0, isMobile || prefersReducedMotion ? 0 : 15]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: prefersReducedMotion ? 0.3 : 0.8, ease: [0.19, 1, 0.22, 1] }
    }
  };

  const imageVariants = {
    hidden: { scale: prefersReducedMotion ? 1 : 1.1, opacity: 0, x: prefersReducedMotion ? 0 : 50 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      x: 0,
      transition: { duration: prefersReducedMotion ? 0.3 : 1, ease: [0.19, 1, 0.22, 1] }
    }
  };

  return (
    <section id="home" className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        <motion.div 
          style={{ y: y2 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p 
            variants={itemVariants}
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-black/40 mb-6"
          >
            "Editing is where the movie is made."
          </motion.p>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-8 relative leading-[0.9] tracking-tight"
          >
            <div className="relative overflow-hidden group">
              <motion.span 
                initial={{ y: "100%", opacity: 0, letterSpacing: "0.1em" }}
                animate={{ y: 0, opacity: 1, letterSpacing: "-0.02em" }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="block text-black" 
              >
                AADARSH
              </motion.span>
            </div>
            <div className="relative overflow-hidden group">
              <motion.span 
                initial={{ y: "100%", opacity: 0, letterSpacing: "0.1em" }}
                animate={{ y: 0, opacity: 1, letterSpacing: "-0.02em" }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="block text-brand-orange" 
              >
                SAH
              </motion.span>
            </div>
            
            {/* Minimal Accent Line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="absolute -left-6 top-0 w-1 h-full bg-black/5 origin-top hidden md:block"
            />
          </motion.h1>
          
          <motion.div variants={itemVariants} className="max-w-md">
            <p className="text-lg font-medium mb-2">Aadarsh Sah — Video Editor & Graphic Designer</p>
            <p className="text-black/60 mb-8 leading-relaxed">
              I create high-impact videos that grow your audience and brand.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {[
                { icon: <Youtube size={18} />, label: 'yt' },
                { icon: <Instagram size={18} />, label: 'ig' },
                { icon: <Facebook size={18} />, label: 'fb' },
                { icon: <MessageCircle size={18} />, label: 'wa' },
              ].map((item, i) => (
                <Magnetic key={i}>
                    <motion.a 
                      href={item.label === 'wa' ? "https://wa.me/9779709026078?text=I%20want%20to%20hire%20you" : item.label === 'yt' ? "https://youtube.com/@adarsh-motion3?si=mb9vm4x8ZcHzlW39" : item.label === 'fb' ? "https://www.facebook.com/share/17S9LvBhnz/?mibextid=wwXIfr" : item.label === 'ig' ? "https://www.instagram.com/aadarsh_motion?igsh=MTV0b285YmI1YTRnaA%3D%3D&utm_source=qr" : "#"}
                      target={item.label === 'wa' || item.label === 'yt' || item.label === 'fb' || item.label === 'ig' ? "_blank" : undefined}
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "#FF9F1C", 
                        color: "#000",
                        borderRadius: "20%",
                        rotate: 10,
                        boxShadow: "0 10px 20px -5px rgba(255, 159, 28, 0.4)"
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center transition-all duration-500 bg-white/50 backdrop-blur-sm"
                    >
                      {item.icon}
                    </motion.a>
                </Magnetic>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-12">
              <Reveal delay={0.4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                >
                  <p className="text-5xl font-black tracking-tighter text-brand-orange">
                    <Counter value={100} suffix="k+" />
                  </p>
                  <p className="text-[10px] uppercase font-bold text-black/40 tracking-[0.2em] mt-2">Views on social media</p>
                </motion.div>
              </Reveal>
              <Reveal delay={0.5}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                  <p className="text-5xl font-black tracking-tighter text-black">
                    <Counter value={45} suffix="+" />
                  </p>
                  <p className="text-[10px] uppercase font-bold text-black/40 tracking-[0.2em] mt-2">Completed Projects</p>
                </motion.div>
              </Reveal>
            </div>
            <div className="flex gap-4 mt-8">
              <Magnetic>
                <a href="#portfolio" className="px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-colors">Portfolio</a>
              </Magnetic>
              <Magnetic>
                <a 
                  href="https://wa.me/9779709026078?text=I%20want%20to%20hire%20you" 
                  target="_blank"
                  className="px-6 py-3 border border-black/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  Contact Me
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Main Hero Image Card */}
          <motion.div 
            animate={{ 
              borderRadius: ["40px", "100px 40px 100px 40px", "40px 100px 40px 100px", "40px"]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="relative z-10 aspect-[4/5] overflow-hidden bg-brand-orange shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <img 
              src="https://iili.io/qkR5xig.md.jpg" 
              alt="Aadarsh Sah" 
              className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 brightness-95 group-hover:brightness-100 sepia-[.05] group-hover:sepia-0"
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
            />
            
            {/* Floating UI Elements */}
            <div className="absolute top-8 left-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-xl">
                <Camera size={24} className="text-white" />
              </div>
            </div>

            <div className="absolute bottom-8 right-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 bg-black rounded-full flex items-center justify-center relative"
              >
                <ArrowUpRight size={32} className="text-brand-orange" />
                <div className="absolute inset-0 border-2 border-dashed border-brand-orange/30 rounded-full scale-110" />
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/5 rounded-full blur-3xl" />
          
          <div className="absolute top-1/2 -right-4 translate-y-[-50%] z-20 flex flex-col gap-3 md:gap-4 scale-75 md:scale-100">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-black/5">
              <Video size={24} className="text-black" />
            </div>
            <div className="w-14 h-14 bg-brand-orange rounded-2xl shadow-xl flex items-center justify-center">
              <Film size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile || prefersReducedMotion ? 0 : -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, isMobile || prefersReducedMotion ? 0 : 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, isMobile || prefersReducedMotion ? 1.2 : 1.3, 1.2]);

  return (
    <section id="about" className="bg-black text-white py-24 md:py-40 overflow-hidden relative">
      {/* Floating Depth Elements */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [isMobile || prefersReducedMotion ? 0 : 100, isMobile || prefersReducedMotion ? 0 : -100]) }}
        className="absolute top-1/4 -right-20 w-80 h-80 border border-white/5 bg-white/5 backdrop-blur-sm rounded-[4rem] rotate-45 z-0 pointer-events-none" 
      />
      
      {/* Scrolling Text Background */}
      <div className="absolute top-10 left-0 w-full overflow-hidden opacity-10 pointer-events-none">
        <div className="scrolling-text flex gap-10 text-[6rem] md:text-[10rem] font-black uppercase">
          <span>about . about . about . about . about . about .</span>
          <span>about . about . about . about . about . about .</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Reveal className="relative mb-24">
            {/* Radial Burst Effect */}
            <div className="absolute inset-0 radial-burst rounded-full animate-spin-slow opacity-30 scale-150" />
            
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <motion.img 
                style={{ y, scale }}
                whileHover={isMobile || prefersReducedMotion ? {} : { scale: 1.25 }}
                transition={{ duration: 0.5 }}
                src="https://iili.io/qSxUT57.md.jpg" 
                alt="Portrait" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Crosshairs */}
            <Plus className="absolute -top-4 -left-4 text-brand-orange" size={32} />
            <Plus className="absolute -top-4 -right-4 text-brand-orange" size={32} />
            <Plus className="absolute -bottom-4 -left-4 text-brand-orange" size={32} />
            <Plus className="absolute -bottom-4 -right-4 text-brand-orange" size={32} />
          </Reveal>

          <div className="max-w-3xl">
            <Reveal>
              <h2 className="text-4xl md:text-8xl font-black uppercase mb-10 tracking-tighter leading-none">
                Capturing the <span className="text-brand-orange">Unseen</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-16 font-medium">
                I am Aadarsh Sah, a dedicated video editor, cameraman, and graphic designer with a passion for visual storytelling. With years of experience in the industry, I specialize in creating cinematic experiences and stunning designs that resonate with audiences.
              </p>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { num: '01', title: 'Vision', desc: 'Translating abstract ideas into compelling visual narratives.' },
                { num: '02', title: 'Execution', desc: 'High-end equipment and advanced editing techniques.' },
                { num: '03', title: 'Impact', desc: 'Creating content that drives engagement and results.' }
              ].map((item, i) => (
                <Reveal key={i} delay={0.3 + i * 0.1}>
                  <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all hover:border-brand-orange/50 group h-full shadow-xl shadow-black/10">
                    <p className="text-brand-orange font-bold mb-4 tracking-widest">{item.num}</p>
                    <h3 className="text-2xl font-bold mb-3 uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const isMobile = useIsMobile();
  const skillsList = [
    "Visual Design",
    "Branding & Identity",
    "Content Creation",
    "Instagram Growth Strategy",
    "Trading Content Design",
    "Viral Storytelling"
  ];

  const toolsList = "Canva, CapCut, VN Editor, Figma, Photoshop, Premiere Pro";

  const progressBars = [
    { name: "Canva", percentage: 90, icon: Palette },
    { name: "Photoshop", percentage: 75, icon: PenTool },
    { name: "Premiere Pro", percentage: 65, icon: Film },
    { name: "CapCut/VN", percentage: 85, icon: Scissors },
  ];

  return (
    <section id="skills" className="bg-gradient-to-b from-black via-[#121a15] to-black text-white py-24 md:py-40 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2 className="text-4xl md:text-8xl font-black uppercase mb-16 md:mb-24 tracking-tighter leading-none">
            My <span className="text-[#00E676]">Skills</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Side */}
          <div className="flex flex-col gap-10">
            <Reveal delay={0.1}>
              <ul className="space-y-4">
                {skillsList.map((skill, i) => (
                  <li key={i} className="flex items-center gap-4 text-xl md:text-2xl font-medium text-white/90">
                    <div className="w-2 h-2 rounded-full bg-[#00E676]" />
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
                <h4 className="text-[#00E676] font-bold uppercase tracking-widest text-xs md:text-sm mb-4">Tools I'm familiar with or currently exploring:</h4>
                <p className="text-white/70 leading-relaxed font-medium text-sm md:text-base">
                  {toolsList}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center gap-12">
            {progressBars.map((bar, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
                        <bar.icon size={24} className="text-[#00E676]" />
                      </div>
                      <span className="text-lg md:text-xl font-bold uppercase tracking-wider">{bar.name}</span>
                    </div>
                    <span className="text-[#00E676] font-black text-xl md:text-2xl">{bar.percentage}%</span>
                  </div>
                  <div className="h-3 md:h-4 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.percentage}%` }}
                      viewport={{ once: true, margin: isMobile ? "-10px" : "-50px" }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                      className="h-full bg-[#00E676] rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                    </motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = ({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (cat: string) => void }) => {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const titleY = useTransform(scrollYProgress, [0, 1], [0, isMobile || prefersReducedMotion ? 0 : -150]);
  
  const categories = ['social media posts', 'ai posts', 'commercial work', 'thumbnails & logos'];

  const categoryThemes = {
    'social media posts': {
      gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      accent: "bg-[#FF5722]",
      bg: "bg-[#1c1412]",
      cardStyle: "aspect-[2/3]",
      label: "Social Media"
    },
    'ai posts': {
      gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      accent: "bg-[#00E5FF]",
      bg: "bg-[#11161a]",
      cardStyle: "aspect-[2/3]",
      label: "AI Post"
    },
    'commercial work': {
      gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      accent: "bg-[#00E676]",
      bg: "bg-[#121a15]",
      cardStyle: "aspect-[2/3]",
      label: "Commercial"
    },
    'thumbnails & logos': {
      gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      accent: "bg-[#D500F9]",
      bg: "bg-[#1a1218]",
      cardStyle: "", // Removed global aspect ratio to allow individual item aspect ratios
      label: "Thumbnails & Logos"
    }
  };

  const currentTheme = categoryThemes[activeCategory as keyof typeof categoryThemes] || categoryThemes['social media posts'];
  
  const projects = {
    'social media posts': [
      { title: 'Travel Film', size: 'small', img: 'https://iili.io/qk4Jd5x.md.png', link: 'https://vt.tiktok.com/ZSusHsDwT/' },
      { title: 'Urban Flow', size: 'small', img: 'https://iili.io/qkPkOKX.md.png' },
      { title: 'Desert Vibes', size: 'small', img: 'https://iili.io/qk6kAml.md.png', link: 'https://www.facebook.com/share/p/183v5bhf9v/?mibextid=wwXIfr' },
      { title: 'Ocean Waves', size: 'small', img: 'https://iili.io/qk6bL74.md.jpg', link: 'https://vt.tiktok.com/ZSusHgeBv/' },
      { title: 'City Lights', size: 'small', img: 'https://iili.io/qkPJKsS.md.png', link: 'https://www.instagram.com/p/DUhspi5E2S5/?igsh=MWR3MnRtcHFqM3hy' },
      { title: 'Skyline View', size: 'small', img: 'https://iili.io/qkiu2dG.md.png', link: 'https://vt.tiktok.com/ZSusHpk97/' },
    ],
    'ai posts': [
      { title: 'Wedding Edit', size: 'small', img: 'https://iili.io/qSIj2Dv.md.png' },
      { title: 'Action Reel', size: 'small', img: 'https://iili.io/qSAPfkb.md.png' },
      { title: 'Abstract Art', size: 'small', img: 'https://iili.io/qSRnODG.md.png' },
      { title: 'Cyberpunk', size: 'small', img: 'https://iili.io/qS072KN.md.png' },
    ],
    'commercial work': [
      { title: 'Music Video', size: 'small', img: 'https://iili.io/qS0QjzN.md.png' },
      { title: 'Fashion Shoot', size: 'small', img: 'https://iili.io/qSAL5ve.md.png' },
      { title: 'Product Ad', size: 'small', img: 'https://iili.io/qUaEX4t.md.png' },
      { title: 'Corporate Event', size: 'small', img: 'https://iili.io/qUaVUnR.md.png' },
    ],
    'thumbnails & logos': [
      { title: 'Studio Session', size: 'small', img: 'https://iili.io/qU1rZWx.md.jpg', link: 'https://youtu.be/ULPhTxEgXug?si=Def7Rz8mZ2QCuxgM', aspect: 'aspect-video' },
      { title: 'Portrait Study', size: 'small', img: 'https://iili.io/qU1ivp9.md.png', aspect: 'aspect-video' },
      { title: 'Landscape View', size: 'small', img: 'https://iili.io/qU1QhBa.md.png', aspect: 'aspect-video' },
      { title: 'Night City', size: 'small', img: 'https://iili.io/qUEl3U7.md.png', link: 'https://youtu.be/3qh4nYmBKjk?si=pKs0XPoby3KzrMHB', aspect: 'aspect-video' },
      { title: 'Morning Light', size: 'small', img: 'https://iili.io/qUEG2Lb.md.png', link: 'https://youtu.be/EkTRzXNtri8?si=qu4ZIFcwPqOE9XBU', aspect: 'aspect-video' },
      { title: 'Vlog Cover', size: 'small', img: 'https://iili.io/qUEWOyN.md.jpg', link: 'https://youtu.be/iMr73w0i_hg?si=-ya7VYI2OA3MKUw6', aspect: 'aspect-video' },
      { id: 'logo-1', title: 'Logo Design 1', size: 'small', img: 'https://iili.io/q4zB8dB.md.png', link: '#', aspect: 'aspect-square' },
      { id: 'logo-2', title: 'Logo Design 2', size: 'small', img: 'https://iili.io/q4zMsCG.md.png', link: '#', aspect: 'aspect-square' },
      { id: 'logo-3', title: 'Logo Design 3', size: 'small', img: 'https://iili.io/q4zDx2f.md.png', link: '#', aspect: 'aspect-square' },
    ]
  };

  const activeProjects = projects[activeCategory as keyof typeof projects];

  return (
    <section id="portfolio" className={`py-24 md:py-40 px-6 transition-colors duration-1000 ease-in-out relative overflow-hidden ${currentTheme.bg}`}>
      {/* Animated Moving Substances */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 -left-32 w-[30rem] h-[30rem] blur-[120px] z-0 pointer-events-none opacity-30 transition-colors duration-1000 ease-in-out ${currentTheme.accent}`} 
      />
      <motion.div 
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          borderRadius: ["50%", "20%", "50%"]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-0 -right-32 w-[30rem] h-[30rem] blur-[120px] z-0 pointer-events-none opacity-20 transition-colors duration-1000 ease-in-out ${currentTheme.accent}`} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative mb-16 md:mb-24">
          <motion.h2 
            key={activeCategory + "-title"}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.1, x: 0 }}
            style={{ y: titleY }}
            className="text-[15vw] md:text-[12vw] font-black uppercase tracking-tighter absolute -top-12 md:-top-16 left-0 pointer-events-none text-white"
          >
            {categoryThemes[activeCategory as keyof typeof categoryThemes]?.label || activeCategory}
          </motion.h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-6 md:gap-8">
            <div>
              <p className={`font-bold uppercase tracking-[0.3em] text-xs mb-3 transition-colors duration-500 ${activeCategory === 'all' ? 'text-brand-orange' : 'text-white/60'}`}>Selected Works</p>
              <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white">my expertise </h3>
            </div>
            
            {/* Category Tabs */}
            <Reveal delay={0.2}>
              <div className="flex flex-wrap justify-center gap-2 p-2 md:p-1 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-full border border-white/10 shadow-xl shadow-black/20 relative">
                {categories.map((cat) => (
                  <Magnetic key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`relative px-4 md:px-6 py-2 min-h-[44px] rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 z-10 ${
                        activeCategory === cat 
                          ? 'text-white' 
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {activeCategory === cat && (
                        <motion.div
                          layoutId="active-pill"
                          className={`absolute inset-0 rounded-full shadow-lg shadow-black/20 ${categoryThemes[cat as keyof typeof categoryThemes]?.accent}`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">
                        <ScrambleText text={categoryThemes[cat as keyof typeof categoryThemes]?.label || cat} />
                      </span>
                    </button>
                  </Magnetic>
                ))}
              </div>
            </Reveal>
          </div>
          
          {/* Subtle Divider */}
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-12 md:mt-16"
          />
        </div>

        <motion.div 
          layout
          className={`grid gap-6 md:gap-8 ${currentTheme.gridClass}`}
        >
          <AnimatePresence mode="popLayout">
            {activeProjects.map((project, i) => (
              <motion.div
                key={`${activeCategory}-${project.title || i}-${project.img}`}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <TiltCard 
                  className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 ${project.aspect || currentTheme.cardStyle}`}
                >
                  <motion.div 
                    onClick={() => window.open(project.link || project.img, '_blank')}
                    whileHover={isMobile || prefersReducedMotion ? {} : { 
                      y: -10,
                      borderRadius: activeCategory === 'ai posts' ? "0px" : "40px 16px 40px 16px"
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full h-full"
                  >
                  <div className="overflow-hidden h-full">
                    <motion.img 
                      whileHover={isMobile || prefersReducedMotion ? {} : { scale: 1.1 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out grayscale-[0.3] contrast-[1.1] brightness-[0.85] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-10`}>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: 0, opacity: 1 }}
                        className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 ease-[0.19,1,0.22,1]"
                        style={{ transform: "translateZ(50px)" }}
                      >
                        <p className={`font-bold text-[11px] uppercase tracking-[0.3em] mb-2 text-white/90`}>{currentTheme.label}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const VideoPlayerModal = ({ video, onClose }: { video: { url: string, title: string, category: string }, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isVertical = video.category === 'Reel' || video.category === 'Shorts';
  const isVimeo = video.url.includes('vimeo.com');

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=0&dnt=1&quality=auto` : url;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(Number(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      setIsMuted(v === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full ${isVertical ? 'max-w-md' : 'max-w-5xl'} bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-orange transition-colors"
        >
          <X size={20} />
        </button>

        <div className={`relative group ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full"
              />
            </div>
          )}

          {isVimeo ? (
            <iframe
              src={getVimeoEmbedUrl(video.url)}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              title={video.title}
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={video.url}
                className={`w-full h-full ${isVertical ? 'object-cover' : ''}`}
                onTimeUpdate={handleProgress}
                onLoadedMetadata={() => {
                  setDuration(videoRef.current?.duration || 0);
                  setIsLoading(false);
                }}
                onCanPlay={() => setIsLoading(false)}
                onWaiting={() => setIsLoading(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                preload="auto"
                playsInline
                autoPlay
              />

              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-brand-orange mb-4"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlay} className="text-white hover:text-brand-orange transition-colors">
                      {isPlaying ? <X size={24} /> : <Play size={24} fill="currentColor" />}
                    </button>

                    <div className="flex items-center gap-2 group/volume">
                      <button onClick={toggleMute} className="text-white hover:text-brand-orange transition-colors">
                        {isMuted || volume === 0 ? <X size={20} /> : <Palette size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolume}
                        className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-brand-orange"
                      />
                    </div>

                    <span className="text-xs font-mono text-white/60">
                      {Math.floor((videoRef.current?.currentTime || 0) / 60)}:
                      {Math.floor((videoRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')} / 
                      {Math.floor(duration / 60)}:
                      {Math.floor(duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button onClick={toggleFullscreen} className="text-white hover:text-brand-orange transition-colors">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{video.title}</h3>
          <p className="text-white/50 text-sm">High-quality cinematic production by Aadarsh Sah.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string, title: string, category: string } | null>(null);
  
  const categories = ['Cinematic', 'Reel', 'Gym', 'Shorts'];

  const videos = [
    // Cinematic
    { title: "Cinematic Vision", desc: "A high-end cinematic production showcasing visual storytelling.", thumbnail: "https://vumbnail.com/1176186153.jpg", url: "https://vimeo.com/1176186153", category: "Cinematic" },
    { title: "Urban Exploration", desc: "Capturing the raw energy and architecture of the city.", thumbnail: "https://vumbnail.com/1176186194.jpg", url: "https://vimeo.com/1176186194", category: "Cinematic" },
    { title: "Nature's Rhythm", desc: "A minimalist exploration of natural light and movement.", thumbnail: "https://vumbnail.com/1176186218_2.jpg", url: "https://vimeo.com/1176186218", category: "Cinematic" },
    
    // Reel
    { title: "Showreel 2024", desc: "A compilation of my best work from 2024.", thumbnail: "https://vumbnail.com/1176189509.jpg", url: "https://vimeo.com/1176189509", category: "Reel" },
    { title: "Directing Reel", desc: "Showcasing my vision and storytelling through direction.", thumbnail: "https://vumbnail.com/1176189462.jpg", url: "https://vimeo.com/1176189462", category: "Reel" },
    { title: "Editing Reel", desc: "Dynamic editing and post-production highlights.", thumbnail: "https://vumbnail.com/1176189416.jpg", url: "https://vimeo.com/1176189416", category: "Reel" },
    
    // Gym
    { title: "Gym Motivation", desc: "High intensity and raw power captured in motion.", thumbnail: "https://vumbnail.com/1176191378.jpg", url: "https://vimeo.com/1176191378", category: "Gym" },
    { title: "Athlete Spotlight", desc: "A cinematic look at the dedication behind the athlete.", thumbnail: "https://vumbnail.com/1176191420.jpg", url: "https://vimeo.com/1176191420", category: "Gym" },
    
    // Shorts
    { title: "Street Food Journey", desc: "A fast-paced exploration of local flavors and street culture.", thumbnail: "https://vumbnail.com/1176192070_2.jpg", url: "https://vimeo.com/1176192070", category: "Shorts" },
    { title: "Daily Vlog Series", desc: "Capturing the beauty in everyday moments and routines.", thumbnail: "https://vumbnail.com/1176192035_3.jpg", url: "https://vimeo.com/1176192035", category: "Shorts" },
    { title: "Tech & Gadgets", desc: "A quick look at the latest innovations and design details.", thumbnail: "https://vumbnail.com/1176191998_2.jpg", url: "https://vimeo.com/1176191998", category: "Shorts" }
  ];

  return (
    <section id="videos" className="py-24 md:py-40 px-6 bg-black text-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal className="mb-20">
          <p className="font-bold uppercase tracking-[0.3em] text-xs text-brand-orange mb-3">Motion Gallery</p>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">My <span className="text-brand-orange">Videos</span></h2>
          <p className="text-white/50 text-lg max-w-md">Explore my creative work across different styles and formats.</p>
        </Reveal>

        <div className="space-y-32">
          {categories.map((category) => {
            const isVertical = category === 'Reel' || category === 'Shorts';
            return (
              <div key={category} id={category.toLowerCase()} className="space-y-12">
                <Reveal>
                  <div className="flex items-center gap-6">
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{category}</h3>
                    <div className="h-px flex-grow bg-white/10" />
                    <span className="text-brand-orange font-mono text-sm tracking-widest">0{categories.indexOf(category) + 1}</span>
                  </div>
                </Reveal>

                <div className={`grid ${isVertical ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                  {videos.filter(v => v.category === category).slice(0, 4).map((video, i) => (
                    <Reveal key={video.title} delay={i * 0.1}>
                      <TiltCard className={`group relative ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/5 bg-white/5 backdrop-blur-sm`}>
                        <div 
                          className="w-full h-full relative"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                              whileHover={{ scale: 1.2 }}
                              className={`w-12 h-12 md:w-16 md:h-16 bg-brand-orange rounded-full flex items-center justify-center shadow-2xl shadow-brand-orange/40`}
                            >
                              <Play size={24} fill="currentColor" className="text-black ml-1" />
                            </motion.div>
                          </div>
                        </div>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <VideoPlayerModal 
            video={selectedVideo} 
            onClose={() => setSelectedVideo(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const Gallery = () => {
  const prefersReducedMotion = useReducedMotion();
  const images = [
    'https://iili.io/qUGCmyN.md.png',
    'https://iili.io/q4fgBcv.md.png',
    'https://iili.io/qUGAedg.md.png',
    'https://iili.io/qUaPeHu.md.png',
    'https://iili.io/qUGVFvp.md.png',
    'https://iili.io/qUGExGj.md.png',
    'https://iili.io/qUGxhTN.md.png',
    'https://iili.io/qUGyPVV.md.png',
  ];

  const customLinks: { [key: number]: string } = {
    0: 'https://youtu.be/GXA7oVpIs1c?si=oMKyvhIN1SNp41Qu',
    1: 'https://youtu.be/f0JUuWcuy9M?si=qXNvAbgW0C4vamLy',
    2: 'https://www.facebook.com/share/p/1DoYAsVgwy/?mibextid=wwXIfr',
    3: 'https://www.facebook.com/share/p/1DeDTLGgYT/',
    4: 'https://www.facebook.com/share/p/18QmVbh7bt/?mibextid=wwXIfr',
    5: 'https://www.facebook.com/share/p/188Jnn3PWa/',
    6: 'https://youtu.be/tEpZYvyXbgk?si=tf9DpyyxZrOs2uKH',
    7: 'https://www.facebook.com/share/p/1GrMna5jBN/?mibextid=wwXIfr'
  };

  return (
    <section id="gallery" className="py-24 md:py-40 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-6">My Work For <span className="text-brand-orange">Freedom Fitness Agency</span></h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">A collection of moments from the field, showcasing the gear, the process, and the passion.</p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {images.map((img, i) => {
            const spans = [
              "col-span-2 md:col-span-2 aspect-video",
              "col-span-2 md:col-span-2 aspect-video",
              "col-span-1 md:col-span-1 aspect-square",
              "col-span-1 md:col-span-1 aspect-square",
              "col-span-1 md:col-span-1 aspect-square",
              "col-span-1 md:col-span-1 aspect-square",
              "col-span-2 md:col-span-2 aspect-video",
              "col-span-2 md:col-span-2 aspect-video",
            ];
            return (
              <a 
                key={i} 
                href={customLinks[i] || img}
                target="_blank"
                rel="noopener noreferrer"
                className={`${spans[i] || ""} relative rounded-2xl overflow-hidden group shadow-lg transition-all duration-500 cursor-pointer block bg-white/5`}
              >
                <motion.img 
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  src={img} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover transition-all duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-brand-orange/90 p-3 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Plus size={24} className="text-black" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Services = ({ onScriptClick, onGraphicDesignClick }: { onScriptClick: () => void, onGraphicDesignClick: () => void }) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const services = [
    { icon: <Camera />, title: 'Photo Shoots', desc: 'Professional photography for portraits, events, and brands.', link: 'https://www.facebook.com/share/p/1CD4qbHRXc/' },
    { icon: <PenTool />, title: 'Script Writing', desc: 'Creative and compelling scripts for videos and stories. Click to view my scripts.' },
    { icon: <Scissors />, title: 'Video Editing', desc: 'Cinematic edits, reels, and YouTube content.', link: '#cinematic' },
    { icon: <Palette />, title: 'Graphic Designing', desc: 'Stunning visual designs for brands and social media.' },
  ];

  return (
    <section id="services" className="py-24 md:py-40 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
          <Reveal className="lg:col-span-1">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Services</h2>
            <p className="text-black/60 mb-10 text-lg leading-relaxed">Elevating your vision through premium production and post-production services.</p>
            <div className="w-20 h-1.5 bg-brand-orange rounded-full" />
          </Reveal>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {services.map((service: any, i) => {
              const CardContent = (
                <motion.div 
                  onClick={service.title === 'Script Writing' ? onScriptClick : service.title === 'Graphic Designing' ? onGraphicDesignClick : undefined}
                  whileHover={isMobile || prefersReducedMotion ? {} : { 
                    y: -10, 
                    boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3)",
                    borderRadius: "32px",
                    borderColor: "rgba(255, 159, 28, 0.4)"
                  }}
                  whileTap={{ scale: 0.97, borderRadius: "32px" }}
                  className={`p-10 bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 transition-all duration-500 group border border-white/20 h-full relative overflow-hidden ${service.title === 'Script Writing' || service.title === 'Graphic Designing' || service.link ? 'cursor-pointer' : ''}`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Magnetic>
                    <motion.div 
                      whileHover={isMobile || prefersReducedMotion ? {} : { 
                        borderRadius: "30%",
                        rotate: 15,
                        scale: 1.1
                      }}
                      className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      {service.icon}
                    </motion.div>
                  </Magnetic>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-brand-orange transition-colors duration-300">{service.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed group-hover:text-black/70 transition-colors duration-300">{service.desc}</p>
                  
                  {service.title === 'Script Writing' && (
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Scripts <ArrowUpRight size={14} />
                    </div>
                  )}
                </motion.div>
              );

              return (
                <Reveal key={i} delay={i * 0.1}>
                  {service.link ? (
                    <a 
                      href={service.link} 
                      target={service.link.startsWith('http') ? "_blank" : undefined} 
                      rel={service.link.startsWith('http') ? "noopener noreferrer" : undefined} 
                      className="block h-full"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    CardContent
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-brand-bg pt-24 md:pt-40 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16 md:mb-24">
          <Reveal className="lg:col-span-2">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-none">Let's create<br />something <span className="text-brand-orange">epic</span>.</h2>
            <a href="mailto:aadarshsah306@gmail.com" className="text-xl md:text-3xl font-bold underline hover:text-brand-orange transition-all duration-300 group inline-block break-all">
              <span className="inline-block">aadarshsah306@gmail.com</span>
            </a>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8">Navigation</h4>
            <ul className="flex flex-col gap-2 font-bold text-lg">
              {['Home', 'About', 'Portfolio', 'Gallery'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-brand-orange transition-all duration-300 inline-block py-2">
                    <ScrambleText text={item} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8">Social</h4>
            <ul className="flex flex-col gap-2 font-bold text-lg">
              {[
                { name: 'Instagram', icon: <Instagram size={20} /> },
                { name: 'YouTube', icon: <Youtube size={20} /> },
                { name: 'Facebook', icon: <Facebook size={20} /> },
                { name: 'WhatsApp', icon: <MessageCircle size={20} /> },
              ].map((item) => (
                <li key={item.name}>
                  <Magnetic>
                    <a href={item.name === 'YouTube' ? "https://youtube.com/@adarsh-motion3?si=mb9vm4x8ZcHzlW39" : item.name === 'Facebook' ? "https://www.facebook.com/share/17S9LvBhnz/?mibextid=wwXIfr" : item.name === 'Instagram' ? "https://www.instagram.com/aadarsh_motion?igsh=MTV0b285YmI1YTRnaA%3D%3D&utm_source=qr" : item.name === 'WhatsApp' ? "https://wa.me/9779709026078?text=I%20want%20to%20hire%20you" : "#"} target={item.name === 'YouTube' || item.name === 'Facebook' || item.name === 'Instagram' || item.name === 'WhatsApp' ? "_blank" : undefined} className="flex items-center gap-3 hover:text-brand-orange transition-all duration-300 cursor-pointer py-2">
                      {item.icon} <ScrambleText text={item.name} />
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.5} className="relative -mt-8 md:-mt-12">
          <h1 className="text-[16vw] font-black uppercase tracking-tighter leading-[0.8] text-black select-none pointer-events-none opacity-100 pb-4 md:pb-8">
            Aadarsh Sah
          </h1>
          <div className="absolute bottom-0 right-0 p-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            © 2026 Visual Motion. All rights reserved.
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showScripts, setShowScripts] = useState(false);
  const [activeCategory, setActiveCategory] = useState('social media posts');
  const { scrollYProgress } = useScroll();

  const handleGraphicDesignClick = () => {
    setActiveCategory('thumbnails & logos');
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader 
            key="preloader" 
            onComplete={() => {
              setIsLoading(false);
              setIsTransitioning(true);
            }} 
          />
        )}
        {isTransitioning && (
          <ShutterTransition 
            key="shutter" 
            onComplete={() => {
              setIsTransitioning(false);
              setShowContent(true);
            }} 
          />
        )}
      </AnimatePresence>

      {showContent && (
        <AnimatePresence mode="wait">
          {showScripts ? (
            <motion.div
              key="scripts-page"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <ScriptsPage onBack={() => setShowScripts(false)} />
            </motion.div>
          ) : (
            <motion.div 
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-brand-orange origin-left z-[100]"
                style={{ scaleX: scrollYProgress }}
              />
              <CursorFollower />
              <BackgroundEffects />
              <Navbar />
              <Hero />
              <About />
              <Skills />
              <Portfolio activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              <VideoSection />
              <Gallery />
              <Services 
                onScriptClick={() => setShowScripts(true)} 
                onGraphicDesignClick={handleGraphicDesignClick}
              />
              <Footer />
              
              <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
                <motion.button 
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: "#FF9F1C",
                    color: "#000",
                    boxShadow: "0 20px 40px -10px rgba(255, 159, 28, 0.5)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-14 h-14 bg-black/80 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl border border-white/20 transition-colors duration-300"
                >
                  <ArrowUpRight size={24} className="-rotate-45" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
