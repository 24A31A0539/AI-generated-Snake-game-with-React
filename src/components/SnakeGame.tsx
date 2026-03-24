import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('neon-snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(SPEED);
  const [level, setLevel] = useState(1);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = (currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setSpeed(SPEED);
    onScoreChange(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      if (gameOver || isPaused) return prevSnake;

      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          
          // Update high score
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('neon-snake-highscore', newScore.toString());
          }

          // Increase speed every 50 points
          if (newScore % 50 === 0) {
            setSpeed(prev => Math.max(prev - 10, 60));
            setLevel(l => l + 1);
          }

          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, onScoreChange]);

  const handleDirectionChange = (newDir: { x: number, y: number }) => {
    if (gameOver) return;
    setIsPaused(false);
    
    // Prevent 180 degree turns
    if (newDir.x !== 0 && lastDirectionRef.current.x === 0) {
      setDirection(newDir);
    } else if (newDir.y !== 0 && lastDirectionRef.current.y === 0) {
      setDirection(newDir);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          handleDirectionChange({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          handleDirectionChange({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          handleDirectionChange({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          handleDirectionChange({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]); // Only depend on gameOver to avoid re-binding

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused, speed]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-black">
      <div 
        className="grid bg-black border-2 border-neon-blue relative"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)'
        }}
      >
        {/* Grid lines for that raw look */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }} 
        />

        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`w-full h-full relative ${
                isSnakeHead ? 'bg-neon-blue shadow-[0_0_8px_#00ffff] z-10' : 
                isSnakeBody ? 'bg-neon-blue/60' : 
                isFood ? 'bg-neon-pink shadow-[0_0_8px_#ff00ff] animate-pulse' : ''
              }`}
            >
              {isSnakeHead && (
                <div className="absolute inset-0 border border-white/50 animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {(gameOver || isPaused) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 font-pixel"
          >
            {gameOver ? (
              <>
                <h2 className="text-2xl font-bold text-neon-pink glitch-text mb-4 tracking-tighter">CRITICAL_FAILURE</h2>
                <div className="flex flex-col items-center mb-8 space-y-2">
                  <p className="text-sm text-white">SCORE: {score}</p>
                  <p className="text-[10px] text-neon-blue">RECORD: {highScore}</p>
                </div>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all text-xs"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-neon-blue glitch-text mb-4 tracking-tighter">SYSTEM_HALTED</h2>
                <p className="text-[10px] text-white/60 mb-8">WAITING_FOR_INPUT...</p>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition-all text-xs"
                >
                  RESUME_LINK
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex gap-8 text-[10px] text-neon-blue font-pixel">
        <div className="flex flex-col items-center">
          <span className="text-[8px] opacity-50">NODE</span>
          <span className="text-neon-pink">{level}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] opacity-50">SIZE</span>
          <span>{snake.length}</span>
        </div>
      </div>

      {/* Touch Controls / D-Pad */}
      <div className="mt-8 grid grid-cols-3 gap-4 lg:hidden">
        <div />
        <button 
          className="w-12 h-12 flex items-center justify-center border border-neon-blue text-neon-blue active:bg-neon-blue active:text-black"
          onClick={() => handleDirectionChange({ x: 0, y: -1 })}
        >
          <ChevronUp size={24} />
        </button>
        <div />
        
        <button 
          className="w-12 h-12 flex items-center justify-center border border-neon-blue text-neon-blue active:bg-neon-blue active:text-black"
          onClick={() => handleDirectionChange({ x: -1, y: 0 })}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="w-12 h-12 flex items-center justify-center border border-neon-pink text-neon-pink active:bg-neon-pink active:text-black"
          onClick={() => setIsPaused(prev => !prev)}
        >
          <div className="w-2 h-2 bg-current" />
        </button>
        <button 
          className="w-12 h-12 flex items-center justify-center border border-neon-blue text-neon-blue active:bg-neon-blue active:text-black"
          onClick={() => handleDirectionChange({ x: 1, y: 0 })}
        >
          <ChevronRight size={24} />
        </button>
        
        <div />
        <button 
          className="w-12 h-12 flex items-center justify-center border border-neon-blue text-neon-blue active:bg-neon-blue active:text-black"
          onClick={() => handleDirectionChange({ x: 0, y: 1 })}
        >
          <ChevronDown size={24} />
        </button>
        <div />
      </div>
    </div>
  );
}
