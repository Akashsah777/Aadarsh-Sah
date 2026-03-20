/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Video, 
  Film, 
  Scissors, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  ArrowUpRight, 
  Menu, 
  X,
  Plus,
  Play,
  ChevronRight,
  Palette,
  Smartphone,
  MessageCircle
} from 'lucide-react';

// --- Components ---

const ShutterTransition = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[95] bg-brand-bg flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-black text-[10px] uppercase tracking-[0.8em] font-black"
      >
        Aadarsh Sah
      </motion.div>
    </motion.div>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const words = ["STORYTELLING", "CINEMATOGRAPHY", "EDITING", "VISION", "MOTION"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length) {
      const timeout = setTimeout(() => setIndex(index + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete, 800);
    }
  }, [index, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)", letterSpacing: "0.2em" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", letterSpacing: "0.05em" }}
            exit={{ opacity: 0, y: -20, scale: 1.1, filter: "blur(10px)", letterSpacing: "0.2em" }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter"
          >
            {words[index] || "VISUAL"}
          </motion.h2>
        </AnimatePresence>
        
        <motion.div 
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute inset-0 bg-brand-orange blur-3xl opacity-20"
        />
      </div>
    </motion.div>
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-bg/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-2xl font-black tracking-tighter flex items-center gap-1">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-brand-orange rounded-full" />
          </div>
          <span>Aadarsh Sah</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium hover:text-brand-orange transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
            Available for hire
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-brand-bg border-b border-black/5 p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-2xl font-bold hover:text-brand-orange transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
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
    hidden: { y: 100, opacity: 0, filter: "blur(10px)" },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0, x: 100 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      x: 0,
      transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] }
    }
  };

  return (
    <section id="home" className="min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
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
            className="text-huge font-black uppercase mb-8 animate-slam"
          >
            <span className="glitch-text inline-block" data-text="visual">visual</span><br />
            <span className="glitch-text inline-block" data-text="motion">motion</span>
          </motion.h1>
          
          <motion.div variants={itemVariants} className="max-w-md">
            <p className="text-lg font-medium mb-2">Aadarsh Sah — Video Editor & Cameraman</p>
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
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black tracking-tighter">+250k</p>
                <p className="text-xs uppercase font-bold text-black/40 tracking-widest mt-1">views on social media</p>
              </div>
              <div>
                <p className="text-4xl font-black tracking-tighter">+800k</p>
                <p className="text-xs uppercase font-bold text-black/40 tracking-widest mt-1">Hours watched, engaging storytelling</p>
              </div>
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
          <div className="relative z-10 aspect-[4/5] rounded-[40px] overflow-hidden bg-brand-orange shadow-2xl group">
            <img 
              src="https://picsum.photos/seed/filmmaker/800/1000" 
              alt="Aadarsh Sah" 
              className="w-full h-full object-cover mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Floating UI Elements */}
            <div className="absolute top-8 left-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
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
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/5 rounded-full blur-3xl" />
          
          <div className="absolute top-1/2 -right-4 translate-y-[-50%] z-20 flex flex-col gap-4">
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
  return (
    <section id="about" className="bg-black text-white py-32 overflow-hidden relative">
      {/* Scrolling Text Background */}
      <div className="absolute top-10 left-0 w-full overflow-hidden opacity-10 pointer-events-none">
        <div className="scrolling-text flex gap-10 text-[10rem] font-black uppercase">
          <span>about . about . about . about . about . about .</span>
          <span>about . about . about . about . about . about .</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-20">
            {/* Radial Burst Effect */}
            <div className="absolute inset-0 radial-burst rounded-full animate-spin-slow opacity-30 scale-150" />
            
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/portrait/600/600" 
                alt="Portrait" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Crosshairs */}
            <Plus className="absolute -top-4 -left-4 text-brand-orange" size={32} />
            <Plus className="absolute -top-4 -right-4 text-brand-orange" size={32} />
            <Plus className="absolute -bottom-4 -left-4 text-brand-orange" size={32} />
            <Plus className="absolute -bottom-4 -right-4 text-brand-orange" size={32} />
          </div>

          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter">
              Capturing the <span className="text-brand-orange">Unseen</span>
            </h2>
            <p className="text-xl text-white/70 leading-relaxed mb-12">
              I am Aadarsh Sah, a dedicated video editor and cameraman with a passion for visual storytelling. With years of experience in the industry, I specialize in creating cinematic experiences that resonate with audiences. My work is a blend of technical precision and artistic intuition.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 border border-white/10 rounded-3xl hover:bg-white/5 transition-colors">
                <p className="text-brand-orange font-bold mb-2">01</p>
                <h3 className="text-xl font-bold mb-2">Vision</h3>
                <p className="text-sm text-white/50">Translating abstract ideas into compelling visual narratives.</p>
              </div>
              <div className="p-6 border border-white/10 rounded-3xl hover:bg-white/5 transition-colors">
                <p className="text-brand-orange font-bold mb-20">02</p>
                <h3 className="text-xl font-bold mb-2">Execution</h3>
                <p className="text-sm text-white/50">High-end equipment and advanced editing techniques.</p>
              </div>
              <div className="p-6 border border-white/10 rounded-3xl hover:bg-white/5 transition-colors">
                <p className="text-brand-orange font-bold mb-2">03</p>
                <h3 className="text-xl font-bold mb-2">Impact</h3>
                <p className="text-sm text-white/50">Creating content that drives engagement and results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    { title: 'Travel Film', category: 'Cinematography', size: 'large', img: 'https://picsum.photos/seed/travel/800/600' },
    { title: 'Wedding Edit', category: 'Editing', size: 'small', img: 'https://picsum.photos/seed/wedding/400/600' },
    { title: 'Music Video', category: 'Direction', size: 'small', img: 'https://picsum.photos/seed/music/400/600' },
    { title: 'Brand Story', category: 'Editing', size: 'medium', img: 'https://picsum.photos/seed/brand/600/400' },
    { title: 'Nature Doc', category: 'Cinematography', size: 'medium', img: 'https://picsum.photos/seed/nature/600/400' },
    { title: 'Action Reel', category: 'Editing', size: 'small', img: 'https://picsum.photos/seed/action/400/600' },
  ];

  return (
    <section id="portfolio" className="py-32 px-6 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-20">
          <h2 className="text-[12vw] font-black uppercase tracking-tighter opacity-10 absolute -top-20 left-0 pointer-events-none">
            portfolio
          </h2>
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-brand-orange font-bold uppercase tracking-widest mb-2">Selected Works</p>
              <h3 className="text-5xl font-black uppercase tracking-tighter">Cinematic Projects</h3>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 font-bold hover:text-brand-orange transition-colors">
              View All Projects <ArrowUpRight size={20} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-[32px] overflow-hidden group cursor-pointer ${
                project.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                project.size === 'medium' ? 'md:col-span-2' : ''
              }`}
            >
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-brand-orange font-bold text-sm uppercase tracking-widest mb-1">{project.category}</p>
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{project.title}</h4>
                <div className="mt-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Play size={20} className="text-black fill-current" />
                </div>
              </div>
              
              {/* Special Orange Card from Reference */}
              {i === 5 && (
                <div className="absolute inset-0 bg-brand-orange mix-blend-multiply opacity-30 group-hover:opacity-0 transition-opacity" />
              )}
            </motion.div>
          ))}
        </div>
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
    <section id="gallery" className="py-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Behind the <span className="text-brand-orange">Lens</span></h2>
          <p className="text-white/50 max-w-xl mx-auto">A collection of moments from the field, showcasing the gear, the process, and the passion.</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl overflow-hidden group"
            >
              <img 
                src={img} 
                alt={`Gallery ${i}`} 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Plus size={40} className="text-brand-orange" />
              </div>
            </motion.div>
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
    <section id="services" className="py-32 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">Services</h2>
            <p className="text-black/60 mb-8">Elevating your vision through premium production and post-production services.</p>
            <div className="w-20 h-1 bg-brand-orange" />
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div key={i} className="p-8 bg-white rounded-[40px] shadow-sm hover:shadow-xl transition-all group border border-black/5">
                <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">{service.title}</h3>
                <p className="text-black/50 text-sm leading-relaxed">{service.desc}</p>
              </div>
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
    <section className="py-32 px-6 bg-brand-bg border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[10vw] font-black uppercase tracking-tighter opacity-5 mb-20 leading-none">exhibitions</h2>
        
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-black/10 hover:bg-black/5 px-4 transition-colors">
              <div className="flex items-center gap-8 mb-4 md:mb-0">
                <span className="text-xs font-bold text-black/30">0{i + 1}</span>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter group-hover:text-brand-orange transition-colors">
                  {item.title}
                </h3>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                <div className="text-right md:text-left">
                  <p className="text-sm font-bold uppercase tracking-widest">{item.location}</p>
                  <p className="text-xs text-black/40 uppercase tracking-widest">{item.date}</p>
                </div>
                <button className="px-8 py-3 rounded-full border border-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-brand-bg pt-32 pb-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
          <div className="lg:col-span-2">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Let's create<br />something <span className="text-brand-orange">epic</span>.</h2>
            <a href="mailto:hello@aadarshsah.com" className="text-2xl font-bold underline hover:text-brand-orange transition-colors">
              hello@aadarshsah.com
            </a>
          </div>
          
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black/30 mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4 font-bold">
              <li><a href="#home" className="hover:text-brand-orange transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-brand-orange transition-colors">About</a></li>
              <li><a href="#portfolio" className="hover:text-brand-orange transition-colors">Portfolio</a></li>
              <li><a href="#gallery" className="hover:text-brand-orange transition-colors">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black/30 mb-6">Social</h4>
            <ul className="flex flex-col gap-4 font-bold">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                  <Instagram size={18} /> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                  <Youtube size={18} /> YouTube
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                  <Twitter size={18} /> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-[20vw] font-black uppercase tracking-tighter leading-none text-black select-none pointer-events-none">
            Aadarsh Sah
          </h1>
          <div className="absolute bottom-0 right-0 p-4 text-xs font-bold uppercase tracking-widest text-black/40">
            © 2026 Visual Motion. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);

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
          <Navbar />
          <Hero />
          <About />
          <Portfolio />
          <Gallery />
          <Services />
          <Experience />
          <Footer />
          
          <div className="fixed bottom-10 right-10 z-50">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl border border-white/10"
            >
              <ArrowUpRight size={24} className="-rotate-45" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
