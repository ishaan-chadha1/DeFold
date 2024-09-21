import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LoadingTest() {
  const [nouns, setNouns] = useState([]);
  const [currentNounIndex, setCurrentNounIndex] = useState(0);

  useEffect(() => {
    const fetchNouns = async () => {
      try {
        const responses = await Promise.all([
          axios.get('/api/noun'),
          axios.get('/api/noun'),
          axios.get('/api/noun'),
          axios.get('/api/noun'),
          axios.get('/api/noun'),
          axios.get('/api/noun')
        ]);
        const nounSvgs = responses.map((res) => res.data);
        setNouns(nounSvgs);
      } catch (error) {
        console.error("Error fetching nouns:", error);
      }
    };

    fetchNouns();
  }, []);

  useEffect(() => {
    if (nouns.length > 0) {
      const interval = setInterval(() => {
        setCurrentNounIndex((prevIndex) => (prevIndex + 1) % nouns.length);
      }, 2000); // Change noun every 2 seconds
      return () => clearInterval(interval);
    }
  }, [nouns.length]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {nouns.length > 0 && (
        <div className="text-white text-center">
          <motion.div
            key={currentNounIndex}
            initial={{ scale: 0.5, rotate: 0, opacity: 0 }}
            animate={{ scale: 1, rotate: 360, opacity: 1 }}
            transition={{
              duration: 2,
              ease: [0.17, 0.67, 0.83, 0.67],
              onComplete: () => {
                setTimeout(() => {
                  setCurrentNounIndex((prevIndex) => (prevIndex + 1) % nouns.length);
                }, 2000); // 3-second pause before switching to next noun
              },
            }}
            dangerouslySetInnerHTML={{ __html: nouns[currentNounIndex] }}
            className="noun-animation"
            style={{
              borderRadius: '50%',
              overflow: 'hidden',
              width: '300px',
              height: '300px',
              display: 'inline-block',
            }}
          />
        </div>
      )}
    </div>
  );
}
