import React, { useState, useRef } from 'react';
import { Music, Play, RotateCcw, Disc, RefreshCw, Undo } from 'lucide-react';

// Define the song data structure
interface SongData {
  id: number;
  songName: string;
  fileName: string;
}

function App() {
  // Hardcoded 60 numbers
  const allNumbers = Array.from({ length: 60 }, (_, i) => i + 1);
  
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(allNumbers);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [fullscreenSpin, setFullscreenSpin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{show: boolean, type: 'revert' | 'reset', message: string} | null>(null);
  const [lastRemovedNumber, setLastRemovedNumber] = useState<number | null>(null);
  const [lastRemovedSong, setLastRemovedSong] = useState<SongData | null>(null);

  // Sample song data - in a real app, you would have all 60 songs
  const songData: SongData[] = [
    { id: 1, songName: "Shape of You - Ed Sheeran", fileName: "shape-of-you.mp3" },
    { id: 2, songName: "Blinding Lights - The Weeknd", fileName: "blinding-lights.mp3" },
    { id: 3, songName: "Dance Monkey - Tones and I", fileName: "dance-monkey.mp3" },
    { id: 4, songName: "Uptown Funk - Mark Ronson ft. Bruno Mars", fileName: "uptown-funk.mp3" },
    { id: 5, songName: "Despacito - Luis Fonsi ft. Daddy Yankee", fileName: "despacito.mp3" },
    { id: 6, songName: "Someone Like You - Adele", fileName: "someone-like-you.mp3" },
    { id: 7, songName: "Bad Guy - Billie Eilish", fileName: "bad-guy.mp3" },
    { id: 8, songName: "Thinking Out Loud - Ed Sheeran", fileName: "thinking-out-loud.mp3" },
    { id: 9, songName: "Shallow - Lady Gaga & Bradley Cooper", fileName: "shallow.mp3" },
    { id: 10, songName: "Hello - Adele", fileName: "hello.mp3" },
    { id: 11, songName: "Stay With Me - Sam Smith", fileName: "stay-with-me.mp3" },
    { id: 12, songName: "Rolling in the Deep - Adele", fileName: "rolling-in-the-deep.mp3" },
    { id: 13, songName: "Shake It Off - Taylor Swift", fileName: "shake-it-off.mp3" },
    { id: 14, songName: "Happy - Pharrell Williams", fileName: "happy.mp3" },
    { id: 15, songName: "All of Me - John Legend", fileName: "all-of-me.mp3" },
    { id: 16, songName: "Roar - Katy Perry", fileName: "roar.mp3" },
    { id: 17, songName: "Can't Stop the Feeling! - Justin Timberlake", fileName: "cant-stop-the-feeling.mp3" },
    { id: 18, songName: "Havana - Camila Cabello", fileName: "havana.mp3" },
    { id: 19, songName: "Perfect - Ed Sheeran", fileName: "perfect.mp3" },
    { id: 20, songName: "Don't Start Now - Dua Lipa", fileName: "dont-start-now.mp3" },
    { id: 21, songName: "Watermelon Sugar - Harry Styles", fileName: "watermelon-sugar.mp3" },
    { id: 22, songName: "Levitating - Dua Lipa", fileName: "levitating.mp3" },
    { id: 23, songName: "drivers license - Olivia Rodrigo", fileName: "drivers-license.mp3" },
    { id: 24, songName: "good 4 u - Olivia Rodrigo", fileName: "good-4-u.mp3" },
    { id: 25, songName: "Stay - The Kid LAROI & Justin Bieber", fileName: "stay.mp3" },
    { id: 26, songName: "Butter - BTS", fileName: "butter.mp3" },
    { id: 27, songName: "Save Your Tears - The Weeknd", fileName: "save-your-tears.mp3" },
    { id: 28, songName: "Dynamite - BTS", fileName: "dynamite.mp3" },
    { id: 29, songName: "positions - Ariana Grande", fileName: "positions.mp3" },
    { id: 30, songName: "Mood - 24kGoldn ft. iann dior", fileName: "mood.mp3" },
    { id: 31, songName: "Heat Waves - Glass Animals", fileName: "heat-waves.mp3" },
    { id: 32, songName: "Montero - Lil Nas X", fileName: "montero.mp3" },
    { id: 33, songName: "Kiss Me More - Doja Cat ft. SZA", fileName: "kiss-me-more.mp3" },
    { id: 34, songName: "Peaches - Justin Bieber", fileName: "peaches.mp3" },
    { id: 35, songName: "Leave the Door Open - Silk Sonic", fileName: "leave-the-door-open.mp3" },
    { id: 36, songName: "Shivers - Ed Sheeran", fileName: "shivers.mp3" },
    { id: 37, songName: "Industry Baby - Lil Nas X", fileName: "industry-baby.mp3" },
    { id: 38, songName: "Bad Habits - Ed Sheeran", fileName: "bad-habits.mp3" },
    { id: 39, songName: "Easy On Me - Adele", fileName: "easy-on-me.mp3" },
    { id: 40, songName: "Cold Heart - Elton John & Dua Lipa", fileName: "cold-heart.mp3" },
    { id: 41, songName: "abcdefu - GAYLE", fileName: "abcdefu.mp3" },
    { id: 42, songName: "Enemy - Imagine Dragons", fileName: "enemy.mp3" },
    { id: 43, songName: "Super Gremlin - Kodak Black", fileName: "super-gremlin.mp3" },
    { id: 44, songName: "Ghost - Justin Bieber", fileName: "ghost.mp3" },
    { id: 45, songName: "Woman - Doja Cat", fileName: "woman.mp3" },
    { id: 46, songName: "Need to Know - Doja Cat", fileName: "need-to-know.mp3" },
    { id: 47, songName: "Happier Than Ever - Billie Eilish", fileName: "happier-than-ever.mp3" },
    { id: 48, songName: "Thats What I Want - Lil Nas X", fileName: "thats-what-i-want.mp3" },
    { id: 49, songName: "My Universe - Coldplay X BTS", fileName: "my-universe.mp3" },
    { id: 50, songName: "Fancy Like - Walker Hayes", fileName: "fancy-like.mp3" },
    { id: 51, songName: "Smokin Out The Window - Silk Sonic", fileName: "smokin-out-the-window.mp3" },
    { id: 52, songName: "Essence - Wizkid ft. Tems", fileName: "essence.mp3" },
    { id: 53, songName: "Rumors - Lizzo ft. Cardi B", fileName: "rumors.mp3" },
    { id: 54, songName: "Beggin - Måneskin", fileName: "beggin.mp3" },
    { id: 55, songName: "Traitor - Olivia Rodrigo", fileName: "traitor.mp3" },
    { id: 56, songName: "Better Days - NEIKED x Mae Muller x Polo G", fileName: "better-days.mp3" },
    { id: 57, songName: "Love Nwantiti - CKay", fileName: "love-nwantiti.mp3" },
    { id: 58, songName: "Sacrifice - The Weeknd", fileName: "sacrifice.mp3" },
    { id: 59, songName: "Big Energy - Latto", fileName: "big-energy.mp3" },
    { id: 60, songName: "Light Switch - Charlie Puth", fileName: "light-switch.mp3" }
  ];
  
  const generateRandomNumber = () => {
    if (availableNumbers.length === 0) {
      alert("All numbers have been selected!");
      return;
    }

    setIsSpinning(true);
    setFullscreenSpin(true);
    
    // Simulate spinning animation with multiple random numbers
    let spinCount = 0;
    const maxSpins = 40; // About 4 seconds of animation
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      setCurrentNumber(availableNumbers[randomIndex]);
      
      spinCount++;
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        finalizeSelection();
      }
    }, 100);
  };

  const finalizeSelection = () => {
    // Select the final number
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];
    
    // Update states
    setCurrentNumber(selectedNumber);
    setSelectedNumbers(prev => [...prev, selectedNumber]);
    
    // Find the song for the selected number
    const song = songData.find(song => song.id === selectedNumber);
    if (song) {
      setCurrentSong(song);
    }
    
    // Remove the selected number from available numbers
    const updatedAvailableNumbers = availableNumbers.filter(num => num !== selectedNumber);
    setAvailableNumbers(updatedAvailableNumbers);
    
    // Clear last removed data since we've made a new selection
    setLastRemovedNumber(null);
    setLastRemovedSong(null);
    
    // Keep fullscreen mode for 2 seconds after spinning stops
    setTimeout(() => {
      setIsSpinning(false);
      
      // After 2 more seconds, exit fullscreen mode with transition
      setTimeout(() => {
        setFullscreenSpin(false);
      }, 2000);
    }, 500);
  };

  const playSong = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Reset audio playing state when song changes
  React.useEffect(() => {
    setIsPlaying(false);
  }, [currentSong]);

  // Function to handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  // Revert last selection
  const revertLastSelection = () => {
    if (selectedNumbers.length === 0) {
      alert("No selections to revert!");
      return;
    }

    // Get the last selected number
    const lastNumber = selectedNumbers[selectedNumbers.length - 1];
    
    // Save it for potential undo
    setLastRemovedNumber(lastNumber);
    
    // Find the song for this number
    const lastSong = songData.find(song => song.id === lastNumber);
    if (lastSong) {
      setLastRemovedSong(lastSong);
    }
    
    // Remove it from selected numbers
    const newSelectedNumbers = selectedNumbers.slice(0, -1);
    setSelectedNumbers(newSelectedNumbers);
    
    // Add it back to available numbers
    setAvailableNumbers([...availableNumbers, lastNumber]);
    
    // Update current number and song
    if (newSelectedNumbers.length > 0) {
      const newCurrentNumber = newSelectedNumbers[newSelectedNumbers.length - 1];
      setCurrentNumber(newCurrentNumber);
      
      const newCurrentSong = songData.find(song => song.id === newCurrentNumber);
      if (newCurrentSong) {
        setCurrentSong(newCurrentSong);
      }
    } else {
      setCurrentNumber(null);
      setCurrentSong(null);
    }
    
    // Close confirmation dialog
    setShowConfirmation(null);
  };

  // Reset all selections
  const resetAllSelections = () => {
    // Initialize all numbers as available
    setAvailableNumbers(allNumbers);
    setSelectedNumbers([]);
    setCurrentNumber(null);
    setCurrentSong(null);
    setLastRemovedNumber(null);
    setLastRemovedSong(null);
    
    // Close confirmation dialog
    setShowConfirmation(null);
  };

  // Show confirmation dialog
  const showConfirmationDialog = (type: 'revert' | 'reset') => {
    const message = type === 'revert' 
      ? "Are you sure you want to revert the last selection?" 
      : "Are you sure you want to reset all selections? This cannot be undone.";
    
    setShowConfirmation({ show: true, type, message });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white relative overflow-hidden">
      {/* Fullscreen spinning overlay */}
      {fullscreenSpin && (
        <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-1000 ${isSpinning ? 'opacity-100' : 'opacity-90'}`}>
          <div className={`number-display ${isSpinning ? 'spinning' : ''} scale-150 transition-all duration-1000`}>
            {currentNumber !== null ? (
              <span className="text-7xl font-bold">{currentNumber}</span>
            ) : (
              <span className="text-4xl font-bold text-purple-300 text-center">Spin to Start</span>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-black animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
            <p className="mb-6">{showConfirmation.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmation(null)} 
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={showConfirmation.type === 'revert' ? revertLastSelection : resetAllSelections} 
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="py-6 text-center">
        <div className="flex flex-col items-center justify-center mb-4">
          {logoUrl ? (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-pink-400 shadow-lg">
              <img src={logoUrl} alt="Game Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4 border-4 border-pink-400 shadow-lg">
              <Music className="h-12 w-12" />
            </div>
          )}
          <label className="cursor-pointer text-xs text-purple-300 hover:text-white mb-4">
            <span className="underline">Change Logo</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleLogoUpload} 
            />
          </label>
        </div>
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <Music className="h-10 w-10" />
          Musical Housie
        </h1>
        <p className="mt-2 text-purple-200">Spin the wheel and discover the music!</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          {/* Control buttons - Repositioned */}
          <div className="w-full max-w-3xl relative mb-12">
            {/* Spin button in center */}
            <div className="flex justify-center">
              <button
                onClick={generateRandomNumber}
                disabled={isSpinning || availableNumbers.length === 0 || fullscreenSpin}
                className={`bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-300 z-10 ${
                  (isSpinning || fullscreenSpin || availableNumbers.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
                style={{ minWidth: '200px' }}
              >
                <span className="text-xl">
                  {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
                </span>
              </button>
            </div>
            
            {/* Revert and Reset buttons in corners */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => showConfirmationDialog('revert')}
                disabled={selectedNumbers.length === 0 || isSpinning || fullscreenSpin}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center gap-1 ${
                  (selectedNumbers.length === 0 || isSpinning || fullscreenSpin) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <Undo className="h-5 w-5" />
                <span>Revert</span>
              </button>
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => showConfirmationDialog('reset')}
                disabled={selectedNumbers.length === 0 || isSpinning || fullscreenSpin}
                className={`bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center gap-1 ${
                  (selectedNumbers.length === 0 || isSpinning || fullscreenSpin) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {!fullscreenSpin && (
            <div className="mt-6 relative">
              <div className={`number-display ${isSpinning ? 'spinning' : ''}`}>
                {currentNumber !== null ? (
                  <span className="text-7xl font-bold">{currentNumber}</span>
                ) : (
                  <span className="text-4xl font-bold text-purple-300">Spin to Start</span>
                )}
              </div>
            </div>
          )}

          {currentSong && !fullscreenSpin && (
            <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-md transform transition-all duration-500 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 text-center">Selected Song</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Disc className="h-10 w-10 mr-3 text-pink-400" />
                  <div>
                    <p className="text-xl font-semibold">{currentSong.songName}</p>
                    <p className="text-sm text-purple-300">Number: {currentSong.id}</p>
                  </div>
                </div>
                <button 
                  onClick={playSong}
                  className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transform transition hover:scale-105"
                >
                  {isPlaying ? <RotateCcw className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
              </div>
              <audio 
                ref={audioRef} 
                src={`/music/${currentSong.fileName}`}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>

        {!fullscreenSpin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Selected Numbers</h2>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-w-4xl mx-auto">
              {Array.from({ length: 60 }, (_, i) => i + 1).map(number => (
                <div 
                  key={number}
                  className={`aspect-square flex items-center justify-center rounded-lg text-lg font-bold ${
                    selectedNumbers.includes(number) 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;