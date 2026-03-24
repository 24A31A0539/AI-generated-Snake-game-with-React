/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Trophy, Music, Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono crt-flicker">
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-20" />
      
      {/* Background Glitch Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-neon-pink/20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-blue/20 animate-pulse" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-pixel tracking-tighter text-neon-blue glitch-text">
          NEURAL_SNAKE.EXE
        </h1>
        <p className="text-neon-pink text-xs mt-4 tracking-[0.3em] font-pixel">
          [ PROTOCOL: ARCADE_V2.4 ]
        </p>
      </motion.header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        {/* Left Sidebar - Data Stream */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-3 space-y-8"
        >
          <div className="neon-border p-6 bg-black/80">
            <div className="flex items-center gap-3 text-neon-blue mb-6 border-b border-neon-blue/30 pb-2">
              <Trophy size={18} />
              <h2 className="font-pixel text-[10px] uppercase tracking-widest">DATA_HARVEST</h2>
            </div>
            <motion.div 
              key={score}
              initial={{ x: -5 }}
              animate={{ x: 0 }}
              className="text-5xl font-pixel text-neon-pink"
            >
              {score.toString().padStart(4, '0')}
            </motion.div>
          </div>

          <div className="neon-border-pink p-6 bg-black/80">
            <div className="flex items-center gap-3 text-neon-pink mb-6 border-b border-neon-pink/30 pb-2">
              <Gamepad2 size={18} />
              <h2 className="font-pixel text-[10px] uppercase tracking-widest">INPUT_MAP</h2>
            </div>
            <ul className="space-y-4 text-xs font-pixel leading-relaxed">
              <li className="flex justify-between items-center text-neon-blue">
                <span>V_AXIS</span> 
                <span className="bg-neon-blue text-black px-1">UP/DN</span>
              </li>
              <li className="flex justify-between items-center text-neon-blue">
                <span>H_AXIS</span> 
                <span className="bg-neon-blue text-black px-1">LF/RT</span>
              </li>
              <li className="flex justify-between items-center text-neon-pink">
                <span>HALT</span> 
                <span className="bg-neon-pink text-black px-1">SPACE</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Center - Core Logic */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative p-2 neon-border bg-black">
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-neon-pink" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-neon-pink" />
            <SnakeGame onScoreChange={setScore} />
          </div>
        </motion.div>

        {/* Right Sidebar - Audio Stream */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-3 space-y-8"
        >
          <div className="flex items-center gap-3 text-neon-blue mb-4 px-2">
            <Music size={18} />
            <h2 className="font-pixel text-[10px] uppercase tracking-widest">SIGNAL_FEED</h2>
          </div>
          <MusicPlayer />
          
          <div className="neon-border p-4 bg-neon-blue/5">
            <p className="text-[10px] text-neon-blue leading-relaxed font-pixel">
              STATUS: NOMINAL<br/>
              LINK: ESTABLISHED<br/>
              THREAT: MINIMAL
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-neon-blue/40 text-[10px] font-pixel flex flex-wrap justify-center gap-12 z-10">
        <span>(C) 2026 NEURAL_LABS</span>
        <span className="animate-pulse">TERMINAL_ACTIVE</span>
        <span>SECURE_LINK_V2</span>
      </footer>
    </div>
  );
}
