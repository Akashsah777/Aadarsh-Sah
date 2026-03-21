/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate, useInView, useSpring } from 'motion/react';
import { 
  Camera, 
  Video, 
  Film, 
  Scissors, 
  Palette, 
  Smartphone, 
  ArrowUpRight, 
  Plus, 
  Play, 
  Instagram, 
  Youtube, 
  Twitter, 
  MessageCircle, 
  Menu, 
  X 
} from 'lucide-react';

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

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
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

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(hover: none)").matches) return;
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

const Reveal = ({ children, delay = 0, width = "auto", className = "" }: { children: React.ReactNode, delay?: number, width?: "auto" | "100%", className?: string, key?: React.Key }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
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
      transition={{ duration: 0.5, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[95] bg-brand-bg flex flex-col items-center justify-center pointer-events-none"
    >
      <motion.div
        key="aadarsh-sah"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black text-center">
          Aadarsh <span className="text-brand-orange">Sah</span>
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-[1px] bg-black/10 mt-4 max-w-[200px]"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-[10px] uppercase tracking-[0.8em] font-black text-black/30"
        >
          Visual Artist
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const words = ["STORYTELLING", "CINEMATOGRAPHY", "EDITING", "VISION"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length - 1) {
      const timeout = setTimeout(() => setIndex(index + 1), 400);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(onComplete, 400);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete, words.length]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
          transition={{ duration: 0.5 }}
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
              className="text-sm font-black uppercase tracking-widest hover:text-brand-orange transition-colors"
            >
              <ScrambleText text={link.name} />
            </a>
          ))}
          <Magnetic>
            <motion.div 
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
            </motion.div>
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
                className="text-4xl font-black uppercase tracking-tighter hover:text-brand-orange transition-colors"
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
  const y1 = useTransform(scrollY, [0, 500], [0, isMobile ? 50 : 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, isMobile ? -30 : -100]);
  const rotate = useTransform(scrollY, [0, 500], [0, isMobile ? 5 : 15]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0, x: 50 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: [0.19, 1, 0.22, 1] }
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
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="block text-black" 
              >
                AADARSH
              </motion.span>
            </div>
            <div className="relative overflow-hidden group">
              <motion.span 
                initial={{ y: "100%", opacity: 0, letterSpacing: "0.1em" }}
                animate={{ y: 0, opacity: 1, letterSpacing: "-0.02em" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="block text-brand-orange" 
              >
                SAH
              </motion.span>
            </div>
            
            {/* Minimal Accent Line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="absolute -left-6 top-0 w-1 h-full bg-black/5 origin-top hidden md:block"
            />
          </motion.h1>
          
          <motion.div variants={itemVariants} className="max-w-md">
            <p className="text-lg font-medium mb-2">Aadarsh Sah — Video Editor & Graphic Designer</p>
            <p className="text-black/60 mb-8 leading-relaxed">
              Welcome to a visual journey that transcends time and space. Discover the artistry of moments captured in motion.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {[
                { icon: <Youtube size={18} />, label: 'yt' },
                { icon: <Instagram size={18} />, label: 'ig' },
                { icon: <Twitter size={18} />, label: 'x' },
                { icon: <MessageCircle size={18} />, label: 'wa' },
              ].map((item, i) => (
                <Magnetic key={i}>
                  <motion.a 
                    href="#" 
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
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                >
                  <p className="text-5xl font-black tracking-tighter text-brand-orange">
                    <Counter value={270} suffix="k+" />
                  </p>
                  <p className="text-[10px] uppercase font-bold text-black/40 tracking-[0.2em] mt-2">Views on social media</p>
                </motion.div>
              </Reveal>
              <Reveal delay={0.5}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                  <p className="text-5xl font-black tracking-tighter text-black">
                    <Counter value={56} suffix="+" />
                  </p>
                  <p className="text-[10px] uppercase font-bold text-black/40 tracking-[0.2em] mt-2">Completed Projects</p>
                </motion.div>
              </Reveal>
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
              className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 brightness-95 group-hover:brightness-100 sepia-[.05] group-hover:sepia-0"
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

          {/* Floating Image Bubble */}
          <div
            className="absolute -top-12 -left-12 w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 backdrop-blur-xl shadow-2xl z-20 hidden md:block cursor-pointer"
          >
            <img 
              src="https://picsum.photos/seed/filmmaker/400/400" 
              alt="Aadarsh Sah Mini" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

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
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -30 : -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 5 : 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, isMobile ? 1.02 : 1.1, 1]);

  return (
    <section id="about" className="bg-black text-white py-24 md:py-40 overflow-hidden relative">
      {/* Floating Depth Elements */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [isMobile ? 30 : 100, isMobile ? -30 : -100]) }}
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
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
                src="https://picsum.photos/seed/portrait/600/600" 
                alt="Portrait" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
                loading="lazy"
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
                I am Aadarsh Sah, a dedicated video editor and cameraman with a passion for visual storytelling. With years of experience in the industry, I specialize in creating cinematic experiences that resonate with audiences.
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

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('social media posts');
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const titleY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -40 : -150]);
  
  const categories = ['social media posts', 'ai posts', 'commercial work', 'thumbnails'];
  
  const projects = {
    'social media posts': [
      { title: 'Travel Film', size: 'large', img: 'https://iili.io/qk4Jd5x.md.png', link: 'https://vt.tiktok.com/ZSusHsDwT/' },
      { title: 'Urban Flow', size: 'small', img: 'https://iili.io/qkPkOKX.md.png' },
      { title: 'Desert Vibes', size: 'small', img: 'https://iili.io/qk6kAml.md.png', link: 'https://www.facebook.com/share/p/183v5bhf9v/?mibextid=wwXIfr' },
      { title: 'Ocean Waves', size: 'large', img: 'https://iili.io/qk6bL74.md.jpg' },
      { title: 'City Lights', size: 'small', img: 'https://iili.io/qkPJKsS.md.png' },
      { title: 'Skyline View', size: 'small', img: 'https://iili.io/qkiu2dG.md.png', link: 'https://vt.tiktok.com/ZSusHpk97/' },
    ],
    'ai posts': [
      { title: 'Wedding Edit', size: 'small', img: 'https://picsum.photos/seed/wedding/400/600' },
      { title: 'Brand Story', size: 'medium', img: 'https://picsum.photos/seed/brand/600/400' },
      { title: 'Action Reel', size: 'small', img: 'https://picsum.photos/seed/action/400/600' },
      { title: 'Tech Future', size: 'large', img: 'https://picsum.photos/seed/tech/800/600' },
      { title: 'Abstract Art', size: 'small', img: 'https://picsum.photos/seed/abstract/400/600' },
      { title: 'Cyberpunk', size: 'medium', img: 'https://picsum.photos/seed/cyberpunk/600/400' },
      { title: 'Neon Dreams', size: 'small', img: 'https://picsum.photos/seed/neon/400/600' },
      { title: 'Space Travel', size: 'large', img: 'https://picsum.photos/seed/space/800/600' },
      { title: 'Robot Mind', size: 'small', img: 'https://picsum.photos/seed/robot/400/600' },
      { title: 'Virtual World', size: 'medium', img: 'https://picsum.photos/seed/virtual/600/400' },
      { title: 'Digital Avatar', size: 'small', img: 'https://picsum.photos/seed/avatar/400/600' },
    ],
    'commercial work': [
      { title: 'Music Video', size: 'small', img: 'https://picsum.photos/seed/music/400/600' },
      { title: 'Fashion Shoot', size: 'medium', img: 'https://picsum.photos/seed/fashion/600/400' },
      { title: 'Product Ad', size: 'small', img: 'https://picsum.photos/seed/product/400/600' },
      { title: 'Corporate Event', size: 'large', img: 'https://picsum.photos/seed/corporate/800/600' },
      { title: 'Food Promo', size: 'small', img: 'https://picsum.photos/seed/food/400/600' },
      { title: 'Car Commercial', size: 'medium', img: 'https://picsum.photos/seed/car/600/400' },
      { title: 'Real Estate', size: 'small', img: 'https://picsum.photos/seed/realestate/400/600' },
      { title: 'App Promo', size: 'large', img: 'https://picsum.photos/seed/app/800/600' },
      { title: 'Fitness Brand', size: 'small', img: 'https://picsum.photos/seed/fitness/400/600' },
      { title: 'Tech Startup', size: 'medium', img: 'https://picsum.photos/seed/startup/600/400' },
      { title: 'Travel Agency', size: 'large', img: 'https://picsum.photos/seed/travel/800/600' },
    ],
    'thumbnails': [
      { title: 'Studio Session', size: 'medium', img: 'https://picsum.photos/seed/studio/600/400' },
      { title: 'Portrait Study', size: 'small', img: 'https://picsum.photos/seed/portrait/400/600' },
      { title: 'Landscape View', size: 'large', img: 'https://picsum.photos/seed/landscape/800/600' },
      { title: 'Night City', size: 'small', img: 'https://picsum.photos/seed/night/400/600' },
      { title: 'Morning Light', size: 'medium', img: 'https://picsum.photos/seed/morning/600/400' },
      { title: 'Vlog Cover', size: 'small', img: 'https://picsum.photos/seed/vlog/400/600' },
      { title: 'Podcast Art', size: 'medium', img: 'https://picsum.photos/seed/podcast/600/400' },
      { title: 'Review Video', size: 'small', img: 'https://picsum.photos/seed/review/400/600' },
      { title: 'Tutorial Thumb', size: 'large', img: 'https://picsum.photos/seed/tutorial/800/600' },
      { title: 'Gaming Stream', size: 'small', img: 'https://picsum.photos/seed/gaming/400/600' },
      { title: 'Reaction Video', size: 'medium', img: 'https://picsum.photos/seed/reaction/600/400' },
    ]
  };

  const activeProjects = projects[activeCategory as keyof typeof projects];

  return (
    <section id="portfolio" className="py-24 md:py-40 px-6 bg-brand-bg relative overflow-hidden">
      {/* Depth Layer */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [isMobile ? -30 : -100, isMobile ? 30 : 100]) }}
        className="absolute top-1/2 -left-32 w-[30rem] h-[30rem] border border-black/5 bg-black/5 backdrop-blur-[2px] rounded-full z-0 pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative mb-16 md:mb-24">
          <motion.h2 
            style={{ y: titleY }}
            className="text-[15vw] md:text-[12vw] font-black uppercase tracking-tighter opacity-10 absolute -top-12 md:-top-16 left-0 pointer-events-none"
          >
            portfolio
          </motion.h2>
          <div className="flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-6 md:gap-8">
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-[0.3em] text-xs mb-3">Selected Works</p>
              <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">my expertise </h3>
            </div>
            
            {/* Category Tabs */}
            <Reveal delay={0.2}>
              <div className="flex flex-wrap justify-center gap-2 p-2 md:p-1 bg-white/40 backdrop-blur-xl rounded-2xl md:rounded-full border border-white/20 shadow-xl shadow-black/5 relative">
                {categories.map((cat) => (
                  <Magnetic key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`relative px-4 md:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 z-10 ${
                        activeCategory === cat 
                          ? 'text-white' 
                          : 'text-black/40 hover:text-black'
                      }`}
                    >
                      {activeCategory === cat && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-black rounded-full shadow-lg shadow-black/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">
                        <ScrambleText text={cat} />
                      </span>
                    </button>
                  </Magnetic>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <motion.div 
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {activeProjects.map((project, i) => (
              <TiltCard 
                key={project.title}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 break-inside-avoid mb-8 w-full inline-block"
              >
                <motion.div 
                  layout
                  onClick={() => project.link && window.open(project.link, '_blank')}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    y: -10,
                    borderRadius: "40px 16px 40px 16px"
                  }}
                  whileTap={{ scale: 0.97, borderRadius: "40px 16px 40px 16px" }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                  className="w-full"
                >
                  <div className="overflow-hidden">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-auto object-cover transition-all duration-1000 ease-in-out grayscale-[0.3] contrast-[1.1] brightness-[0.85] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-6 md:p-10">
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: 0, opacity: 1 }}
                        className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700 ease-[0.19,1,0.22,1]"
                        style={{ transform: "translateZ(50px)" }}
                      >
                        <p className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] mb-2">{activeCategory}</p>
                        <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">
                          <ScrambleText text={project.title} />
                        </h4>
                        <Magnetic>
                          <motion.div 
                            whileHover={{ scale: 1.1, backgroundColor: "#FF9F1C" }}
                            whileTap={{ scale: 0.97, backgroundColor: "#FF9F1C" }}
                            className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300"
                          >
                            <Play size={16} className="text-black fill-current md:w-5 md:h-5" />
                          </motion.div>
                        </Magnetic>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    'https://picsum.photos/seed/cam1/600/800',
    'https://picsum.photos/seed/cam2/600/400',
    'https://picsum.photos/seed/cam3/600/600',
    'https://picsum.photos/seed/cam4/600/800',
    'https://picsum.photos/seed/cam5/600/400',
    'https://picsum.photos/seed/cam6/600/600',
  ];

  return (
    <section id="gallery" className="py-24 md:py-40 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-6">Behind the <span className="text-brand-orange">Lens</span></h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">A collection of moments from the field, showcasing the gear, the process, and the passion.</p>
        </Reveal>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((img, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <TiltCard>
                <motion.div 
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderRadius: "40px 12px 40px 12px"
                  }}
                  whileTap={{ scale: 0.97, borderRadius: "40px 12px 40px 12px" }}
                  className="relative rounded-2xl overflow-hidden group shadow-lg transition-all duration-500 cursor-pointer"
                >
                  <motion.img 
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    src={img} 
                    alt={`Gallery ${i}`} 
                    className="w-full h-auto grayscale md:hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Plus size={40} className="text-brand-orange" />
                  </div>
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <Video />, title: 'Cinematography', desc: 'Professional shooting for events, films, and commercials.' },
    { icon: <Scissors />, title: 'Video Editing', desc: 'Cinematic edits, reels, and YouTube content.' },
    { icon: <Palette />, title: 'Color Grading', desc: 'Professional color correction and stylistic grading.' },
    { icon: <Camera />, title: 'Photography', desc: 'Creative portraits, lifestyle, and brand shoots.' },
    { icon: <Smartphone />, title: 'Social Content', desc: 'Optimized content for TikTok, Reels, and Shorts.' },
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
            {services.map((service, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3)",
                    borderRadius: "32px",
                    borderColor: "rgba(255, 159, 28, 0.4)"
                  }}
                  whileTap={{ scale: 0.97, borderRadius: "32px" }}
                  className="p-10 bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 transition-all duration-500 group border border-white/20 h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Magnetic>
                    <motion.div 
                      whileHover={{ 
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
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const items = [
    { title: 'Cinematic Visions Unveiled', location: 'Madrid Gallery, Spain', date: '21 Nov 2023' },
    { title: 'Frames in Motion', location: 'Manchester Museum, UK', date: '20 Nov 2023' },
    { title: 'Journey Through Time', location: 'Milan Gallery, Italy', date: '19 Nov 2023' },
    { title: 'Experimental Narratives', location: 'Paris Museum, France', date: '18 Nov 2023' },
  ];

  return (
    <section className="py-24 md:py-40 px-6 bg-brand-bg border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-[12vw] md:text-[10vw] font-black uppercase tracking-tighter opacity-5 mb-16 md:mb-24 leading-none">exhibitions</h2>
        </Reveal>
        
        <div className="flex flex-col">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div 
                whileTap={{ scale: 0.98, backgroundColor: "rgba(0,0,0,0.05)" }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-black/10 hover:bg-black/5 px-6 transition-all duration-700 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-10 mb-6 md:mb-0">
                  <span className="text-xs font-bold text-black/30 tracking-widest">0{i + 1}</span>
                  <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter group-hover:text-brand-orange transition-colors duration-700">
                    {item.title}
                  </h3>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
                  <div className="text-left">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] mb-1">{item.location}</p>
                    <p className="text-xs text-black/40 uppercase tracking-[0.2em]">{item.date}</p>
                  </div>
                  <motion.button 
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "#FF9F1C", 
                      color: "#000", 
                      boxShadow: "0 10px 30px -10px rgba(255, 159, 28, 0.5)",
                      borderRadius: "12px",
                      borderColor: "transparent"
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="px-10 py-4 min-h-[44px] rounded-full border border-black text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500"
                  >
                    View Project
                  </motion.button>
                </div>
              </motion.div>
            </Reveal>
          ))}
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
            <a href="mailto:hello@aadarshsah.com" className="text-xl md:text-3xl font-bold underline hover:text-brand-orange transition-all duration-300 group inline-block break-all">
              <span className="inline-block">hello@aadarshsah.com</span>
            </a>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8">Navigation</h4>
            <ul className="flex flex-col gap-5 font-bold text-lg">
              {['Home', 'About', 'Portfolio', 'Gallery'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-brand-orange transition-all duration-300 inline-block">
                    <ScrambleText text={item} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-8">Social</h4>
            <ul className="flex flex-col gap-5 font-bold text-lg">
              {[
                { name: 'Instagram', icon: <Instagram size={20} /> },
                { name: 'YouTube', icon: <Youtube size={20} /> },
                { name: 'Twitter', icon: <Twitter size={20} /> },
                { name: 'WhatsApp', icon: <MessageCircle size={20} /> },
              ].map((item) => (
                <li key={item.name}>
                  <Magnetic>
                    <a href="#" className="flex items-center gap-3 hover:text-brand-orange transition-all duration-300 cursor-pointer">
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
  const { scrollYProgress } = useScroll();

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          <Portfolio />
          <Gallery />
          <Services />
          <Experience />
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
    </div>
  );
}
