import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, ChevronUp, Filter, Calendar, Tag, FileText } from 'lucide-react';
import { useSound } from '../context/SoundContext';

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
    title: "Gaming Channel Comeback",
    description: "A heartfelt script about returning to gaming after a long break, overcoming challenges, and starting a new chapter.",
    category: 'Other',
    date: 'March 2026',
    content: `
🎙️ (Intro – 0:00 – 0:40)

“1 saal…
Haan, 1 saal ho gaya aap sab ko milay hue.
Kabhi socha bhi nahi tha ki main itna lamba break lunga.
Shayad aap me se kai log soch rahe honge — ‘Bhai kahaan gaya?’

Sach kahu toh… life ne thoda pause maar diya tha.
Game ka jo fire tha mere andar… wo kabhi bujha nahi. 🔥
Lekin kuch baatein aisi hui jinke baare me baat karni chahiye.”

🎙️ (Story Time – 0:40 – 2:30)

“Sabse pehle… doston ne dhokha diya.
Jin logon ko apna samjha, unhone hi piche se vaar kiya.
Us time laga — sab kuch khatam ho gaya.

PUBG ka ID bechna pada 💔
Khelne ke liye device bhi acha nahi tha…
Har din dil me ye chubta tha ki main kuch kar nahi pa raha.

Ghar ki zimmedari bhi aagayi…
Din bhar tension, aur raat ko bas sochta rehta tha — ‘ab kya?’
Dheere dheere maine apne aap ko sabse door kar liya.
Akelepan ko maine apna comfort zone bana liya…
Lekin andar se dil me sirf ek awaaz aati thi —
“Yaar… tu is liye nahi bana tha.””

🎙️ (Turning Point – 2:30 – 3:40)

“Aur aaj main yahi kehne aaya hoon…
Main wapas aa gaya hoon.
Main apne aap ko is comfort zone se bahar nikal raha hoon.
Kyunki main jaanta hoon — ye channel sirf ek channel nahi…
Ye meri kahani hai. Mera sapna hai. 🫡🔥

Jis cheez ke liye maine ye channel shuru kiya tha —
ab main usi pe full focus karunga.
PUBG se shuruaat hui thi…
GTA aur naye games ke saath ab naye chapter ki shuruaat hone wali hai.”

🎙️ (Motivation & Message to Viewers – 3:40 – 4:40)

“Main akele khelne wala gamer nahi hoon…
Aap sab mere sath ho.
Aapka support hi meri strength hai 💪
Is baar sirf content nahi aayega…
is baar energy, fire aur consistency aayegi.

Mujhe pata hai — zero se shuruaat mushkil hoti hai,
lekin mujhe bhi pata hai — main akela nahi hoon.
Aap sab mere family ho ❤️”

🎙️ (Outro – 4:40 – 5:00)

“Agar aap purane ho — welcome back squad 🔥
Agar naye ho — subscribe karo, kyunki asli game ab shuru ho raha hai.”
    `
  },
  {
    id: '3',
    title: 'Freedom Fitness Promo & Review',
    description: 'A promotional script and member review format for Freedom Fitness.',
    category: 'Ad',
    date: 'March 2026',
    content: `
🎥 GYM JOIN गर्नु अघि के सोच्ने?
What to Consider Before Joining a Gym

“Gym join गर्नु अघि सबैभन्दा पहिले आफ्नो goal clear गर्नुहोस्।
के तपाईं weight loss चाहनुहुन्छ, muscle gain, वा overall fitness?

Fitness short-term motivation होइन, यो long-term commitment हो।
Consistency बिना कुनै पनि result सम्भव हुँदैन।

सही gym environment र qualified trainer छनौट गर्नु अत्यन्त महत्वपूर्ण हुन्छ।
Proper guidance ले तपाईंको progress छिटो बनाउँछ र injury को risk कम गर्छ।

Freedom Fitness मा हामी तपाईंको goal अनुसार structured training र proper support प्रदान गर्छौं।


2

🎥 1️⃣ Nepali Member Review Script
🎤 Intro

“आज हामी Freedom Fitness का एक सदस्यसँग छोटो प्रतिक्रिया लिँदैछौं 💪
उहाँको अनुभव सुन्नौं।”

❓ Questions

“तपाईं Freedom Fitness मा कति समयदेखि training गर्दै हुनुहुन्छ?”
“Gym join गर्दा तपाईंको goal के थियो?”
“अहिलेसम्म कस्तो progress महसुस गर्नुभएको छ?”
“यहाँको environment र trainer support कस्तो लाग्यो?”
“के तपाईं अरूलाई पनि यहाँ join गर्न recommend गर्नुहुन्छ? किन?”

🎤 Closing

“धन्यवाद तपाईंको प्रतिक्रिया का लागि।
Freedom Fitness — जहाँ तपाईंको progress हाम्रो priority हो”
    `
  }
];

const ScriptCard = ({ script }: { script: Script }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { playSound } = useSound();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => playSound('hover')}
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
            onClick={() => {
              setIsExpanded(!isExpanded);
              playSound('click');
            }}
            onMouseEnter={() => playSound('hover')}
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
  const { playSound } = useSound();
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
              onClick={() => {
                onBack();
                playSound('click');
              }}
              onMouseEnter={() => playSound('hover')}
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
                onClick={() => {
                  setFilter(cat);
                  playSound('click');
                }}
                onMouseEnter={() => playSound('hover')}
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
