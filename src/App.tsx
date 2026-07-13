import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, RotateCcw, Disc3, RefreshCw, Undo2, Settings, Zap } from 'lucide-react';
import AdminPanel, { SongData } from './AdminPanel';
import { getAllAudioUrls } from './db';

const STORAGE_KEY = 'musicalHousieState';
const SONGS_KEY = 'musicalHousieSongs';

const DEFAULT_SONGS: SongData[] = [
  { id: 1,  songName: "Woh Kisna hai",                    fileName: "1. Woh Kisna hai.mp3" },
  { id: 2,  songName: "Go Go Govinda",                    fileName: "2. Go Go Govinda.mp3" },
  { id: 3,  songName: "Yaara Teri Yaari",                 fileName: "3. Yaara Teri Yaari.mp3" },
  { id: 4,  songName: "Shree Ramji Padhare",              fileName: "4. shri-ramji-padhare.mp3" },
  { id: 5,  songName: "Mata Sherawali",                   fileName: "5. Mata sherawali.mp3" },
  { id: 6,  songName: "Kariye Guru Gun Gan",              fileName: "6. kariye guru gun gan.mp3" },
  { id: 7,  songName: "Aaya Hai Toofan",                  fileName: "07. AAYA HAI TOOFAN.m4a" },
  { id: 8,  songName: "Ghor Andhari Re",                  fileName: "8. ghor andhari re.mp3" },
  { id: 9,  songName: "Rasiyo Rupalo",                    fileName: "9. Rasiyo Rupalo.mp3" },
  { id: 10, songName: "Gori Radha",                       fileName: "10. Gori Radha.mp3" },
  { id: 11, songName: "Rang Bhini Radha",                 fileName: "11. Rang Bhini Radha.mp3" },
  { id: 12, songName: "Mor Bani Thanghat Kare",           fileName: "12. Mor Bani Thanghat Kare.mp3" },
  { id: 13, songName: "Nagar Nandji Na Lal",              fileName: "13. nagar nandji na lal.mp3" },
  { id: 14, songName: "Ekadantaya Vakratundaya",          fileName: "14. Ekadantaya Vakratundaya.mp3" },
  { id: 15, songName: "India Wale",                       fileName: "15. India Wale.mp3" },
  { id: 16, songName: "Chak De India",                    fileName: "16. Chak De India.mp3" },
  { id: 17, songName: "Ranchod Rangila",                  fileName: "17. Ranchod Rangila.mp3" },
  { id: 18, songName: "Ram Aayenge",                      fileName: "18. Ram Aayenge.mp3" },
  { id: 19, songName: "BhaiBandh Ma hoy fer",       fileName: "19. Bhai bandh ma ghano fer se.mp3" },
  { id: 20, songName: "Dwarika No Nath",                  fileName: "20. Dwarika No Nath.mp3" },
  { id: 21, songName: "Piya Ghar Aavenge",       fileName: "21. E Ri Sakhi Mangal Gaavo RE.mp3" },
  { id: 22, songName: "Tame Kadiya Maliya",               fileName: "22. TAME KADIYA MALIYA.mp3" },
  { id: 23, songName: "Aavo Swami Bhale Padharya",        fileName: "23. Aavo Swami Bhale Padharya.mp3" },
  { id: 24, songName: "Hari Maro Jhalo Haath",            fileName: "24. Hari Maro Jhalo Haath.mp3" },
  { id: 25, songName: "Shivaji Halaradu",                 fileName: "25. SHIVAJI HALARADU.mp4" },
  { id: 26, songName: "Dhanya Dhanya Avasar",     fileName: "26. Dhanya Dhanya Avasar Aayo Re.mp3" },
  { id: 27, songName: "Rang Lagyo",                       fileName: "27. Rang Lagyo.mp3" },
  { id: 28, songName: "Samarpit Samarpit",                fileName: "28. Samarpit Samarpit.mp3" },
  { id: 29, songName: "Bolya Shree Hari Re",              fileName: "29. Bolya Shree Hari Re.mp3" },
  { id: 30, songName: "Kesariya Mane Ho",                 fileName: "30. Kesariya  Mane ho.mp3" },
  { id: 31, songName: "Purshottam Pragat Malya",          fileName: "31. Purshottam Pragat malya.mp3" },
  { id: 32, songName: "Moghra Na Fool",                   fileName: "32. moghra na fool.mp3" },
  { id: 33, songName: "Mare Mandir Mahle Re",             fileName: "33. Mare Mandir Mahle Re.mp3" },
  { id: 34, songName: "Aaj Suvarna Avasar",               fileName: "34. Aaj Suvarna Avasar.mp3" },
  { id: 35, songName: "Sabse Uonchi",                     fileName: "35. Sabse Uonchi.mp3" },
  { id: 36, songName: "Jode Chho Maharaj",                fileName: "36. Jode Chho Maharaj.mp3" },
  { id: 37, songName: "Dil Tum Tum Kare",                 fileName: "37. Dil Tum Tum Kare.mp3" },
  { id: 38, songName: "Padharya Padharya",                fileName: "38. PADHARYA PADHARYA.m4a" },
  { id: 39, songName: "Swami Avtariya",                   fileName: "39. Swami Avtariya.mp3" },
  { id: 40, songName: "Vagya Re Vagya Re",  fileName: "40. vagya re Vagya re Gurubhakti Na.mp3" },
  { id: 41, songName: "He Bakrol Vasi",                   fileName: "41. He Bakrol vasi.mpeg.mp3" },
  { id: 42, songName: "Jivan Denara He Swami",            fileName: "42. Jivan Denara He Swami.mp3" },
  { id: 43, songName: "Phoolon Sa Chehra Tera",           fileName: "43. Phoolon Sa Chehra tera.mp3" },
  { id: 44, songName: "Teri Ajab Anokhi Chaal",           fileName: "44. Teri Ajab anokhi Chaal.mp3" },
  { id: 45, songName: "Naujawan Naujawan",                fileName: "45.Naujawan Naujawan.mp3" },
  { id: 46, songName: "Hilode Chadhya Haiya",             fileName: "46.Hilode Chadhya Haiya.mp3" },
  { id: 47, songName: "Atmiya Raas",                      fileName: "47.Atmiya Raas.mp3" },
  { id: 48, songName: "Kanthee Re Bandhavi",              fileName: "48. Kanthee Re Bandhavi.mp3" },
  { id: 49, songName: "Bhaji Le Bhagwan",                 fileName: "49.Bhaji Le Bhagwan.mp3" },
  { id: 50, songName: "Maru Mann Haricharan",             fileName: "50. Maru Mann Haricharan.mp3" },
  { id: 51, songName: "Mangal Bela",                      fileName: "51. mangal bela.m4a" },
  { id: 52, songName: "Bade Acche Lagte Hai",             fileName: "52.Bade Acche Lagte Hai.mp3" },
  { id: 53, songName: "Thayu Hari Nu Aagman",             fileName: "53.Thayu Hari Nu Aagman.mp3" },
  { id: 54, songName: "Ange Ang Ma",       fileName: "54. Ange Ang ma..Hari ne dhaari.mp3" },
  { id: 55, songName: "Tu Chale Mari Saath",              fileName: "55.Tu chale mari saath.mp3" },
  { id: 56, songName: "Tari Gunatit Sadhuta",             fileName: "56. TARI GUNATIT SADHUTA.mp3" },
  { id: 57, songName: "Mere Sang He Piya",                fileName: "57.Mere Sang He Piya.mp3" },
  { id: 58, songName: "Purna Akshardhami",                fileName: "58.Purna Akshardhami.mp3" },
  { id: 59, songName: "Sadhutane Vaari Jau Re",       fileName: "59.Eni Sadhutane Vaari Jau Re.....mp3" },
  { id: 60, songName: "Hari Swami Aavya Re",              fileName: "60.Hari Swami Aavya Re.mp3" },
];

function loadSongs(): SongData[] {
  try {
    const saved = localStorage.getItem(SONGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SONGS;
}

function App() {
  const allNumbers = Array.from({ length: 60 }, (_, i) => i + 1);
  const [activeTab, setActiveTab] = useState<'game' | 'admin'>('game');
  const [songData, setSongData] = useState<SongData[]>(loadSongs);

  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { availableNumbers: allNumbers, selectedNumbers: [], currentNumber: null, currentSong: null, lastRemovedNumber: null, lastRemovedSong: null };
  };

  const [availableNumbers, setAvailableNumbers] = useState<number[]>(loadState().availableNumbers);
  const [selectedNumbers, setSelectedNumbers]   = useState<number[]>(loadState().selectedNumbers);
  const [currentNumber, setCurrentNumber]       = useState<number | null>(loadState().currentNumber);
  const [isSpinning, setIsSpinning]             = useState(false);
  const [currentSong, setCurrentSong]           = useState<SongData | null>(loadState().currentSong);
  const audioRef                                = useRef<HTMLAudioElement | null>(null);
  const spinAudioRef                            = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [fullscreenSpin, setFullscreenSpin]     = useState(false);
  const [showConfirm, setShowConfirm]           = useState<{ type: 'revert' | 'reset' } | null>(null);
  const [lastRemovedNumber, setLastRemovedNumber] = useState<number | null>(loadState().lastRemovedNumber);
  const [lastRemovedSong, setLastRemovedSong]     = useState<SongData | null>(loadState().lastRemovedSong);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ availableNumbers, selectedNumbers, currentNumber, currentSong, lastRemovedNumber, lastRemovedSong }));
  }, [availableNumbers, selectedNumbers, currentNumber, currentSong, lastRemovedNumber, lastRemovedSong]);

  const handleSongsChange = (updated: SongData[]) => {
    setSongData(updated);
    const toStore = updated.map(({ customBlob, ...rest }) => rest);
    localStorage.setItem(SONGS_KEY, JSON.stringify(toStore));
  };

  // Load persisted audio blobs from IndexedDB on mount
  useEffect(() => {
    getAllAudioUrls().then(urlMap => {
      if (urlMap.size > 0) {
        setSongData(prev => prev.map(s => {
          const url = urlMap.get(s.id);
          return url ? { ...s, customBlob: url, hasCustomAudio: true } : s;
        }));
      }
    }).catch(() => { /* IndexedDB unavailable — use defaults */ });
  }, []);

  const generateRandomNumber = () => {
    if (availableNumbers.length === 0) return;
    setIsSpinning(true);
    setFullscreenSpin(true);
    if (spinAudioRef.current) { spinAudioRef.current.currentTime = 0; spinAudioRef.current.play().catch(() => {}); }
    let spinCount = 0;
    const iv = setInterval(() => {
      setCurrentNumber(availableNumbers[Math.floor(Math.random() * availableNumbers.length)]);
      if (++spinCount >= 40) { clearInterval(iv); finalizeSelection(); }
    }, 100);
  };

  const finalizeSelection = () => {
    const idx = Math.floor(Math.random() * availableNumbers.length);
    const num = availableNumbers[idx];
    setCurrentNumber(num);
    setSelectedNumbers(prev => [...prev, num]);
    const song = songData.find(s => s.id === num);
    if (song) setCurrentSong(song);
    setAvailableNumbers(availableNumbers.filter(n => n !== num));
    setLastRemovedNumber(null);
    setLastRemovedSong(null);
    setTimeout(() => { setIsSpinning(false); setTimeout(() => setFullscreenSpin(false), 2000); }, 500);
  };

  const playSong = async () => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { try { await audioRef.current.play(); setIsPlaying(true); } catch {} }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause(); audioRef.current.load(); setIsPlaying(false);
  }, [currentSong]);

  const revertLastSelection = () => {
    if (!selectedNumbers.length) return;
    const last = selectedNumbers[selectedNumbers.length - 1];
    setLastRemovedNumber(last);
    const lastSong = songData.find(s => s.id === last);
    if (lastSong) setLastRemovedSong(lastSong);
    const newSel = selectedNumbers.slice(0, -1);
    setSelectedNumbers(newSel);
    setAvailableNumbers([...availableNumbers, last]);
    if (newSel.length > 0) {
      const nc = newSel[newSel.length - 1];
      setCurrentNumber(nc);
      const ns = songData.find(s => s.id === nc);
      if (ns) setCurrentSong(ns);
    } else { setCurrentNumber(null); setCurrentSong(null); }
    setShowConfirm(null);
  };

  const resetAllSelections = () => {
    setAvailableNumbers(allNumbers); setSelectedNumbers([]); setCurrentNumber(null);
    setCurrentSong(null); setLastRemovedNumber(null); setLastRemovedSong(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowConfirm(null);
  };

  const resolvedAudioSrc = currentSong ? (currentSong.customBlob ?? `/songs/${currentSong.fileName}`) : '';
  const progress = ((60 - availableNumbers.length) / 60) * 100;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-mesh" />
      <audio ref={spinAudioRef} src="/songs/bg.mp3" />

      {/* ── Nav ── */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(108,92,231,0.3)', boxShadow: '0 2px 8px rgba(108,92,231,0.15)' }}>
            <img src="/hpym.jpg" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Musical Housie
          </span>
        </div>

        <div className="tab-bar">
          <button className={`tab-pill ${activeTab === 'game' ? 'active' : ''}`} onClick={() => setActiveTab('game')}>
            <Music size={15} /> Game
          </button>
          <button className={`tab-pill ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
            <Settings size={15} /> Admin
          </button>
        </div>
      </nav>

      {/* ── Admin Tab ── */}
      {activeTab === 'admin' && <AdminPanel songs={songData} onSongsChange={handleSongsChange} />}

      {/* ── Game Tab ── */}
      {activeTab === 'game' && (
        <main style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Fullscreen spin overlay */}
          {fullscreenSpin && (
            <div className="spin-overlay" style={{ zIndex: 200 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                <div className={`number-display ${isSpinning ? 'spinning' : ''}`} style={{ width: 260, height: 260 }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '5rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {currentNumber ?? '—'}
                  </span>
                </div>
                {!isSpinning && currentSong && (
                  <div className="animate-fadeIn" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Now Playing</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", margin: 0 }}>{currentSong.songName}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirm dialog */}
          {showConfirm && (
            <div className="modal-backdrop">
              <div className="modal">
                <div style={{ padding: '28px 28px 0' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                    {showConfirm.type === 'reset' ? 'Reset everything?' : 'Revert last pick?'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    {showConfirm.type === 'reset'
                      ? 'All selected numbers will be cleared and the game will restart from scratch.'
                      : 'The last selected number will be returned to the pool.'}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '20px 28px 28px' }}>
                  <button className="btn-ghost" onClick={() => setShowConfirm(null)}>Cancel</button>
                  <button
                    onClick={showConfirm.type === 'revert' ? revertLastSelection : resetAllSelections}
                    style={{ padding: '10px 22px', borderRadius: 99, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', border: 'none', background: showConfirm.type === 'reset' ? 'var(--danger)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))', color: '#fff', transition: 'opacity 0.15s', boxShadow: '0 4px 14px var(--accent-glow)' }}
                  >
                    {showConfirm.type === 'reset' ? 'Reset' : 'Revert'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Hero section ── */}
          <section style={{ textAlign: 'center', padding: '40px 0 48px' }}>
            

            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Spin &amp; Discover
            </h1>
            

            {/* Number display */}
            {!fullscreenSpin && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
                <div className={`number-display ${isSpinning ? 'spinning' : ''}`}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '4.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {currentNumber ?? '—'}
                  </span>
                </div>
              </div>
            )}

            {/* Spin button */}
            <button
              className="btn-primary"
              onClick={generateRandomNumber}
              disabled={isSpinning || availableNumbers.length === 0 || fullscreenSpin}
              style={{ fontSize: '1.05rem', padding: '16px 48px' }}
            >
              <Zap size={18} />
              {isSpinning ? 'Spinning…' : availableNumbers.length === 0 ? 'All Done!' : 'Spin the Wheel'}
            </button>

            {/* Action row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
              <button
                className="btn-ghost"
                onClick={() => setShowConfirm({ type: 'revert' })}
                disabled={!selectedNumbers.length || isSpinning || fullscreenSpin}
              >
                <Undo2 size={15} /> Revert
              </button>
              <button
                className="btn-danger"
                onClick={() => setShowConfirm({ type: 'reset' })}
                disabled={!selectedNumbers.length || isSpinning || fullscreenSpin}
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>
          </section>

          {/* ── Now Playing card ── */}
          {currentSong && !fullscreenSpin && (
            <div className={`song-card animate-fadeIn ${isPlaying ? 'playing' : ''}`} style={{ maxWidth: 480, margin: '0 auto 48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px var(--accent-glow)' }}>
                    <Disc3 size={26} color="#fff" className={isPlaying ? 'disc-spin' : ''} />
                  </div>
                  <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, padding: '2px 5px', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}>
                    #{currentSong.id}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4, margin: '0 0 4px' }}>Now Playing</p>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {currentSong.songName}
                  </p>
                </div>
                <button
                  onClick={playSong}
                  style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px var(--accent-glow)', flexShrink: 0, transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isPlaying ? <Pause size={18} color="#fff" /> : <Play size={18} color="#fff" />}
                </button>
              </div>
              <audio ref={audioRef} src={resolvedAudioSrc} preload="auto" onEnded={() => setIsPlaying(false)} />
            </div>
          )}

        
          {/* ── Number grid ── */}
          {!fullscreenSpin && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 16, margin: '0 0 16px' }}>All Numbers</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
                {allNumbers.map(n => (
                  <div
                    key={n}
                    className={`num-cell ${n === currentNumber ? 'current' : selectedNumbers.includes(n) ? 'selected' : ''}`}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
