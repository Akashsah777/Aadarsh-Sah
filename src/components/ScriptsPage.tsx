import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, ChevronUp, Filter, Calendar, Tag, FileText } from 'lucide-react';

interface Script {
  id: string;
  title: string;
  description: string;
  category: 'Ad' | 'Reel' | 'Short Film' | 'Other';
  date: string;
  content: string;
}

const scriptsData: Script[] = [
  {
    id: '1',
    title: 'Happy Holi ❤️',
    description: 'A nostalgic and emotional script about the changing essence of festivals and the loss of childhood excitement.',
    category: 'Reel',
    date: 'March 2026',
    content: `
“Sabko wish kar diya…”

“Status bhi laga diya…”

“Par pata nahi kyu…”

“Dil se khushi aa hi nahi rahi.”

“Yaad hai bachpan me…”

“Ek din pehle se excitement hoti thi…”

“Kapde kharab hone ka darr nahi…”

“Bas hassi… aur rang.”

(0.5 sec pause)

“Ab rang to hai…”

“Par chehre pe wali chamak nahi.”

(Outro – slow + heavy)

“Shayad festival wahi hai…
Bas hum pehle jaise nahi rahe”
    `
  },
  {
    id: '2',
    title: "I'm Fine",
    description: 'A relatable and deep script exploring the common habit of hiding true emotions behind a simple "I\'m fine".',
    category: 'Reel',
    date: 'March 2026',
    content: `
“Kabhi notice kiya hai…
hum ‘I’m fine’ kitni baar bol dete hain…
jabki hum fine hote hi nahi.”

Middle:
“Log puchte hain ‘sab thik hai?’
aur hum bas smile karke bol dete hain ‘haan’.”

“Par sach ye hai…
kuch baatein kisi ko samjhana possible hi nahi hota.”

Ending (engagement line):
“Sach batao…
tum bhi ‘I’m fine’ bolte ho jab tum actually fine nahi hote?”
    `
  }
];

const ScriptCard = ({ script }: { script: Script }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-orange/30 transition-colors duration-300 shadow-xl shadow-black/10"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-orange/20">
                {script.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} />
                {script.date}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-2">
              {script.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
              {script.description}
            </p>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-brand-orange hover:text-black text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-transparent self-start"
          >
            {isExpanded ? (
              <>Close <ChevronUp size={14} /></>
            ) : (
              <>Read More <ChevronDown size={14} /></>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 border-t border-white/10 mt-2">
                <div className="bg-black/40 rounded-xl p-6 md:p-8 font-mono text-sm md:text-base text-white/80 leading-relaxed whitespace-pre-wrap border border-white/5">
                  {script.content}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ScriptsPage = ({ onBack }: { onBack: () => void }) => {
  const [filter, setFilter] = useState<'All' | 'Ad' | 'Reel' | 'Short Film'>('All');
  const categories: ('All' | 'Ad' | 'Reel' | 'Short Film')[] = ['All', 'Ad', 'Reel', 'Short Film'];

  const filteredScripts = filter === 'All' 
    ? scriptsData 
    : scriptsData.filter(s => s.category === filter);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-brand-orange/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-brand-orange hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Home</span>
            </button>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
              My <span className="text-brand-orange">Scripts</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-xl font-medium">
              Creative scripts and storytelling work
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-brand-orange text-black shadow-lg shadow-brand-orange/20' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}s
              </button>
            ))}
          </motion.div>
        </div>

        {/* Scripts Grid */}
        <motion.div 
          layout
          className="flex flex-col gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredScripts.length > 0 ? (
              filteredScripts.map((script, i) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ScriptCard script={script} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center border border-dashed border-white/10 rounded-3xl"
              >
                <FileText size={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-white/30 font-bold uppercase tracking-widest">No scripts found in this category</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 pt-12 border-t border-white/10 text-center"
        >
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 Scripting Excellence
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ScriptsPage;
