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
  const spinAudioRef = useRef<HTMLAudioElement | null>(null); // New ref for spin background music
  const [isPlaying, setIsPlaying] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [fullscreenSpin, setFullscreenSpin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{show: boolean, type: 'revert' | 'reset', message: string} | null>(null);
  const [lastRemovedNumber, setLastRemovedNumber] = useState<number | null>(null);
  const [lastRemovedSong, setLastRemovedSong] = useState<SongData | null>(null);

  // Sample song data - in a real app, you would have all 60 songs
  const songData: SongData[] = [
    { id: 1, songName: "Woh Kisna hai", fileName: "1. Woh Kisna hai.mp3" },
    { id: 2, songName: "Go Go Govinda", fileName: "2. Go Go Govinda.mp3" },
    { id: 3, songName: "Shiv Tandav", fileName: "3. Shiv Tandav.mp3" },
    { id: 4, songName: "Virpur Javu Ke", fileName: "4. virpur javu ke.mp3" },
    { id: 5, songName: "Mata Sherawali", fileName: "5. Mata sherawali.mp3" },
    { id: 6, songName: "Hu Gokul No Govadiyo", fileName: "6. Hu Gokul No Govadiyo.mp3" },
    { id: 7, songName: "Aaya Hai Toofan", fileName: "07. AAYA HAI TOOFAN.m4a" },
    { id: 8, songName: "Ghor Andhari Re", fileName: "8. ghor andhari re.mp3" },
    { id: 9, songName: "Rasiyo Rupalo", fileName: "9. Rasiyo Rupalo.mp3" },
    { id: 10, songName: "Gori Radha", fileName: "10. Gori Radha.mp3" },
    { id: 11, songName: "Rang Bhini Radha", fileName: "11. Rang Bhini Radha.mp3" },
    { id: 12, songName: "Mor Bani Thanghat Kare", fileName: "12. Mor Bani Thanghat Kare.mp3" },
    { id: 13, songName: "Nagar Nandji Na Lal", fileName: "13. nagar nandji na lal.mp3" },
    { id: 14, songName: "Ekadantaya Vakratundaya", fileName: "14. Ekadantaya Vakratundaya.mp3" },
    { id: 15, songName: "India Wale", fileName: "15. India Wale.mp3" },
    { id: 16, songName: "Chak De India", fileName: "16. Chak De India.mp3" },
    { id: 17, songName: "Ranchod Rangila", fileName: "17. Ranchod Rangila.mp3" },
    { id: 18, songName: "Ram Aayenge", fileName: "18. Ram Aayenge.mp3" },
    { id: 19, songName: "Bhai Bandh Ma Ghano Fer Se", fileName: "19. Bhai bandh ma ghano fer se.mp3" },
    { id: 20, songName: "Dwarika No Nath", fileName: "20. Dwarika No Nath.mp3" },
    { id: 21, songName: "E Ri Sakhi Mangal Gaavo RE", fileName: "21. E Ri Sakhi Mangal Gaavo RE.mp3" },
    { id: 22, songName: "Tame Kadiya Maliya", fileName: "22. TAME KADIYA MALIYA.mp3" },
    { id: 23, songName: "Aavo Swami Bhale Padharya", fileName: "23. Aavo Swami Bhale Padharya.mp3" },
    { id: 24, songName: "Hari Maro Jhalo Haath", fileName: "24. Hari Maro Jhalo Haath.mp3" },
    { id: 25, songName: "Shivaji Halaradu", fileName: "25. SHIVAJI HALARADU.mp4" },
    { id: 26, songName: "Dhanya Dhanya Avasar Aayo Re", fileName: "26. Dhanya Dhanya Avasar Aayo Re.mp3" },
    { id: 27, songName: "Rang Lagyo", fileName: "27. Rang Lagyo.mp3" },
    { id: 28, songName: "Samarpit Samarpit", fileName: "28. Samarpit Samarpit.mp3" },
    { id: 29, songName: "Bolya Shree Hari Re", fileName: "29. Bolya Shree Hari Re.mp3" },
    { id: 30, songName: "Kesariya Mane Ho", fileName: "30. Kesariya  Mane ho.mp3" },
    { id: 31, songName: "Purshottam Pragat Malya", fileName: "31. Purshottam Pragat malya.mp3" },
    { id: 32, songName: "Moghra Na Fool", fileName: "32. moghra na fool.mp3" },
    { id: 33, songName: "Mare Mandir Mahle Re", fileName: "33. Mare Mandir Mahle Re.mp3" },
    { id: 34, songName: "Aaj Suvarna Avasar", fileName: "34. Aaj Suvarna Avasar.mp3" },
    { id: 35, songName: "Sabse Uonchi", fileName: "35. Sabse Uonchi.mp3" },
    { id: 36, songName: "Jode Chho Maharaj", fileName: "36. Jode Chho Maharaj.mp3" },
    { id: 37, songName: "Dil Tum Tum Kare", fileName: "37. Dil Tum Tum Kare.mp3" },
    { id: 38, songName: "Padharya Padharya", fileName: "38. PADHARYA PADHARYA.m4a" },
    { id: 39, songName: "Swami Avtariya", fileName: "39. Swami Avtariya.mp3" },
    { id: 40, songName: "Vagya Re Vagya Re Gurubhakti Na", fileName: "40. vagya re Vagya re Gurubhakti Na.mp3" },
    { id: 41, songName: "Rang Lagyo", fileName: "41. rang lagyo.mp3" },
    { id: 42, songName: "Jivan Denara He Swami", fileName: "42. Jivan Denara He Swami.mp3" },
    { id: 43, songName: "Phoolon Sa Chehra Tera", fileName: "43. Phoolon Sa Chehra tera.mp3" },
    { id: 44, songName: "Teri Ajab Anokhi Chaal", fileName: "44. Teri Ajab anokhi Chaal.mp3" },
    { id: 45, songName: "Naujawan Naujawan", fileName: "45.Naujawan Naujawan.mp3" },
    { id: 46, songName: "Hilode Chadhya Haiya", fileName: "46.Hilode Chadhya Haiya.mp3" },
    { id: 47, songName: "Atmiya Raas", fileName: "47.Atmiya Raas.mp3" },
    { id: 48, songName: "Kanthee Re Bandhavi", fileName: "48. Kanthee Re Bandhavi.mp3" },
    { id: 49, songName: "Bhaji Le Bhagwan", fileName: "49.Bhaji Le Bhagwan.mp3" },
    { id: 50, songName: "Maru Mann Haricharan", fileName: "50. Maru Mann Haricharan.mp3" },
    { id: 51, songName: "Mangal Bela", fileName: "51. mangal bela.m4a" },
    { id: 52, songName: "Bade Acche Lagte Hai", fileName: "52.Bade Acche Lagte Hai.mp3" },
    { id: 53, songName: "Thayu Hari Nu Aagman", fileName: "53.Thayu Hari Nu Aagman.mp3" },
    { id: 54, songName: "Ange Ang Ma Hari Ne Dhaari", fileName: "54. Ange Ang ma..Hari ne dhaari.mp3" },
    { id: 55, songName: "Tu Chale Mari Saath", fileName: "55.Tu chale mari saath.mp3" },
    { id: 56, songName: "Tari Gunatit Sadhuta", fileName: "56. TARI GUNATIT SADHUTA.mp3" },
    { id: 57, songName: "Mere Sang He Piya", fileName: "57.Mere Sang He Piya.mp3" },
    { id: 58, songName: "Purna Akshardhami", fileName: "58.Purna Akshardhami.mp3" },
    { id: 59, songName: "Eni Sadhutane Vaari Jau Re", fileName: "59.Eni Sadhutane Vaari Jau Re.....mp3" },
    { id: 60, songName: "Hari Swami Aavya Re", fileName: "60.Hari Swami Aavya Re.mp3" }
  ];
  
  
  
  const generateRandomNumber = () => {
    if (availableNumbers.length === 0) {
      alert("All numbers have been selected!");
      return;
    }

    setIsSpinning(true);
    setFullscreenSpin(true);
    
    // Start the spinning background music
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0; // Reset to beginning
      spinAudioRef.current.play().catch(e => console.error("Error playing spin sound:", e));
    }
    
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
    
    // Clear last removed data
    setLastRemovedNumber(null);
    setLastRemovedSong(null);
    
    // Keep fullscreen mode for 2 seconds after spinning stops
    setTimeout(() => {
      setIsSpinning(false);
      
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
      {/* Add the spinning background music audio element */}
      <audio 
        ref={spinAudioRef} 
        src="/songs/bg.mp3" // Make sure to add this file to your public folder
        loop={false} // Loop the music during spinning
      />
      
      {/* Fullscreen spinning overlay */}
      {fullscreenSpin && (
        <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center transition-opacity duration-1000 ${isSpinning ? 'opacity-100' : 'opacity-90'}`}>
          <div className={`number-display ${isSpinning ? 'spinning' : ''} scale-150 transition-all duration-1000`}>
            {currentNumber !== null ? (
              <span className="text-7xl font-bold">{currentNumber}</span>
            ) : (
              <span className="text-4xl font-bold text-purple-300 text-center">0</span>
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
        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg mr-4">
            <img src="/hpym.jpg" alt="Game Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
              <Music className="h-10 w-10" />
              Musical Housie
            </h1>
          </div>
        </div>
        <p className="mt-2 text-purple-200 text-center">Spin the wheel and discover the music!</p>
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
            <div className="absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-1/2">
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
            
            <div className="absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2">
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
                  <span className="text-7xl font-bold text-purple-200">0</span>
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
                    <p className="text-sm text-purple-300">Number: <span className="font-bold">{currentSong.id}</span></p>
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
                src={`/songs/${currentSong.fileName}`}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.error("Audio error:", e)}
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
