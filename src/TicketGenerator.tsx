import React, { useState, useRef, useCallback } from 'react';
import { Ticket as TicketIcon, Download, Eye, Sparkles, X, Grid3X3, Hash, LayoutGrid, Loader2 } from 'lucide-react';
import { SongData } from './AdminPanel';

/* ───────────────────────── Types ───────────────────────── */

interface Ticket {
  id: number;
  songs: SongData[];
}

type DesignType = 'classic' | 'royal' | 'modern' | 'festive';

interface GridOption {
  label: string;
  rows: number;
  cols: number;
}

interface TicketProps {
  ticket: Ticket;
  rows: number;
  cols: number;
}

/* ───────────────────── Constants ───────────────────────── */

const GRID_OPTIONS: GridOption[] = [
  { label: '3 × 3  (9 songs)',  rows: 3, cols: 3 },
  { label: '3 × 4  (12 songs)', rows: 3, cols: 4 },
  { label: '4 × 3  (12 songs)', rows: 4, cols: 3 },
  { label: '4 × 4  (16 songs)', rows: 4, cols: 4 },
  { label: '5 × 3  (15 songs)', rows: 5, cols: 3 },
  { label: '3 × 5  (15 songs)', rows: 3, cols: 5 },
];

const DESIGNS: { key: DesignType; name: string; desc: string; accent: string; bg: string; headerBg: string }[] = [
  { key: 'classic', name: 'Classic Cream',   desc: 'Elegant parchment with maroon',  accent: '#8B1A2B', bg: '#FFF8E7',  headerBg: '#8B1A2B' },
  { key: 'royal',   name: 'Dark Minimal',    desc: 'Sleek black & bronze design',    accent: '#ffdec2', bg: '#0a0a0a',  headerBg: '#6b5140' },
  { key: 'modern',  name: 'Modern Gradient', desc: 'Clean contemporary style',       accent: '#6c5ce7', bg: '#f8f7ff',  headerBg: 'linear-gradient(135deg,#6c5ce7,#e84393)' },
  { key: 'festive', name: 'Festive Gold',    desc: 'Warm golden spiritual tones',    accent: '#B8860B', bg: '#FFFEF5',  headerBg: '#B8860B' },
];

const TICKETS_STORAGE_KEY = 'musicalHousieTickets';

/* ───────────────────── Utilities ───────────────────────── */

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateTickets(songs: SongData[], count: number, cellsPerTicket: number): Ticket[] {
  const tickets: Ticket[] = [];
  for (let i = 0; i < count; i++) {
    const shuffled = shuffle(songs);
    tickets.push({
      id: i + 1,
      songs: shuffled.slice(0, cellsPerTicket),
    });
  }
  return tickets;
}

const VerticalText = ({ text, color }: { text: string, color: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>
    {text.split('').map((char, i) => (
      <span key={i} style={{ lineHeight: 1.1 }}>{char === ' ' ? '\u00A0' : char}</span>
    ))}
  </div>
);

/* ─────────── Ticket Design: Classic Cream ─────────────── */

function ClassicTicket({ ticket, rows, cols }: TicketProps) {
  return (
    <div className="ticket-for-pdf" style={{
      width: 780, minHeight: 280, background: '#FDF5E6',
      border: '4px solid #8B1A2B', borderRadius: 10, display: 'flex',
      fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Left sidebar */}
      <div style={{
        width: 60, minWidth: 60, background: '#8B1A2B',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '12px 4px', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, minWidth: 40, minHeight: 40, borderRadius: '50%', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img src="/hpym.jpg" alt="Logo" style={{
            width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
          }} />
        </div>
        <VerticalText text="MUSICAL HOUSIE" color="#FFFFFF" />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '14px 16px' }}>
          <h3 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: '1.2rem', color: '#8B1A2B', letterSpacing: '0.25em',
            textTransform: 'uppercase', margin: 0, lineHeight: 1,
          }}>
            HARI PRABODHAM
          </h3>
        </div>

        {/* Grid */}
        <div style={{
          display: 'table', width: '100%', flex: 1, borderCollapse: 'collapse',
          tableLayout: 'fixed', borderTop: '1px solid #C4A882',
        }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} style={{ display: 'table-row' }}>
              {Array.from({ length: cols }).map((_, c) => {
                const i = r * cols + c;
                const song = ticket.songs[i];
                if (!song) return <div key={c} style={{ display: 'table-cell' }} />;
                return (
                  <div key={c} style={{
                    display: 'table-cell', verticalAlign: 'middle', textAlign: 'center',
                    padding: '15px 5px 20px 5px', height: 'auto', boxSizing: 'border-box',
                    borderRight: c < cols - 1 ? '1px solid #C4A882' : 'none',
                    borderBottom: '1px solid #C4A882',
                  }}>
                    <span style={{
                      fontFamily: "'Inter', sans-serif", fontWeight: 700,
                      fontSize: '1.5rem', color: '#8B1A2B', display: 'block',
                    }}>
                      {song.id}
                    </span>
                    <span style={{
                      fontSize: '0.55rem', color: '#5C3A1E', fontWeight: 500,
                      lineHeight: 1.4, marginTop: 4, display: 'block', paddingBottom: 5,
                    }}>
                      {song.songName}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#8B1A2B', fontWeight: 700, letterSpacing: '0.05em' }}>
            TICKET #{String(ticket.id).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Right decorative */}
      <div style={{
        width: 60, minWidth: 60, background: '#FDF5E6',
        borderLeft: '1px solid #C4A882', display: 'flex',
        flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '12px 4px', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, minWidth: 40, minHeight: 40, borderRadius: '50%', background: '#fff',
          border: '1px solid #C4A882', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img src="/hpym.jpg" alt="" style={{
            width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', opacity: 0.8,
          }} />
        </div>
        <VerticalText text="JAY SWAMINARAYAN" color="#A08060" />
      </div>
    </div>
  );
}

/* ─────────── Ticket Design: Royal Purple ──────────────── */

function RoyalTicket({ ticket, rows, cols }: TicketProps) {
  return (
    <div className="ticket-for-pdf" style={{
      width: 780, minHeight: 280, background: '#0a0a0a', borderRadius: 12,
      display: 'flex', fontFamily: "'Inter', sans-serif",
      overflow: 'hidden', position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Main content (Black Section) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 28px', minWidth: 0 }}>
        {/* Header — Logo + Title centered */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, marginBottom: 16,
        }}>
          <div style={{
            width: 36, height: 36, minWidth: 36, minHeight: 36, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src="/hpym.jpg" alt="Logo" style={{
              width: 30, height: 30, borderRadius: '50%', objectFit: 'cover',
            }} />
          </div>
          <h3 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: '1.15rem', color: '#ffdec2', letterSpacing: '0.25em',
            textTransform: 'uppercase', margin: 0, lineHeight: 1,
            position: 'relative', top: -1, marginRight: '-0.25em'
          }}>
            HARI PRABODHAM
          </h3>
        </div>

        {/* Grid */}
        <div style={{
          display: 'table', width: '100%', flex: 1, borderCollapse: 'collapse',
          tableLayout: 'fixed', borderTop: '1px solid #333',
        }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} style={{ display: 'table-row' }}>
              {Array.from({ length: cols }).map((_, c) => {
                const i = r * cols + c;
                const song = ticket.songs[i];
                if (!song) return <div key={c} style={{ display: 'table-cell' }} />;
                return (
                  <div key={c} style={{
                    display: 'table-cell', verticalAlign: 'middle', textAlign: 'center',
                    padding: '15px 5px 20px 5px', height: 'auto', boxSizing: 'border-box',
                    borderRight: c < cols - 1 ? '1px solid #333' : 'none',
                    borderBottom: '1px solid #333',
                  }}>
                    <span style={{
                      fontFamily: "'Inter', sans-serif", fontWeight: 700,
                      fontSize: '1.5rem', color: '#ffdec2', display: 'block',
                    }}>
                      {song.id}
                    </span>
                    <span style={{
                      fontSize: '0.55rem', color: '#888', fontWeight: 500,
                      lineHeight: 1.4, marginTop: 4, display: 'block', paddingBottom: 5,
                    }}>
                      {song.songName}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer with sparkle + ticket number */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sparkles size={16} color="#ffdec2" />
          <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>
            TICKET #{String(ticket.id).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Right Sidebar (Brown Section) */}
      <div style={{
        width: 100, minWidth: 100, background: '#6b5140',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '20px 8px', gap: 16, flexShrink: 0,
      }}>
        <VerticalText text="JAY SWAMINARAYAN" color="#ffffff" />
      </div>
    </div>
  );
}

/* ────────── Ticket Design: Modern Gradient ────────────── */

function ModernTicket({ ticket, rows, cols }: TicketProps) {
  return (
    <div className="ticket-for-pdf" style={{
      width: 780, background: 'linear-gradient(145deg, #f8f7ff, #f0efff)',
      borderRadius: 14, display: 'flex', fontFamily: "'Inter', sans-serif",
      overflow: 'hidden', position: 'relative',
      border: '1px solid rgba(108,92,231,0.12)',
    }}>
      {/* Left sidebar */}
      <div style={{
        width: 76, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '16px 8px', gap: 14, flexShrink: 0,
        background: 'rgba(255,255,255,0.6)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(108,92,231,0.3)',
        }}>
          <img src="/hpym.jpg" alt="Logo" style={{
            width: 36, height: 36, borderRadius: 10, objectFit: 'cover',
          }} />
        </div>
        <VerticalText text="MUSICAL HOUSIE" color="#6c5ce7" />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 10px 10px 0' }}>
        {/* Header */}
        <div style={{
          padding: '8px 16px 10px', textAlign: 'center',
        }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: '1.1rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', margin: 0,
            color: '#2d3436',
          }}>
            Hari Prabodham
          </h3>
        </div>

        {/* Grid */}
        <div style={{
          display: 'table', width: '100%', flex: 1,
          tableLayout: 'fixed', borderSpacing: '5px', borderCollapse: 'separate',
        }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} style={{ display: 'table-row' }}>
              {Array.from({ length: cols }).map((_, c) => {
                const i = r * cols + c;
                const song = ticket.songs[i];
                if (!song) return <div key={c} style={{ display: 'table-cell' }} />;
                return (
                  <div key={c} style={{
                    display: 'table-cell', verticalAlign: 'middle', textAlign: 'center',
                    padding: '10px 3px 15px 3px', height: 'auto', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.8)', borderRadius: 8,
                    border: '1px solid rgba(108,92,231,0.08)',
                    boxShadow: '0 1px 4px rgba(108,92,231,0.06)',
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                      fontSize: '1.2rem', display: 'block',
                      color: '#6c5ce7',
                    }}>
                      {song.id}
                    </span>
                    <span style={{
                      fontSize: '0.5rem', color: '#596A7A', fontWeight: 500,
                      lineHeight: 1.4, marginTop: 4, display: 'block', paddingBottom: 5,
                    }}>
                      {song.songName}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px 4px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.1em',
            color: '#6c5ce7',
          }}>
            TICKET #{String(ticket.id).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Right decorative */}
      <div style={{
        width: 70, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 10,
        gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(232,67,147,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/hpym.jpg" alt="" style={{
            width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', opacity: 0.4,
          }} />
        </div>
        <VerticalText text="JAY SWAMINARAYAN" color="#8F9CA8" />
      </div>
    </div>
  );
}

/* ─────────── Ticket Design: Festive Gold ──────────────── */

function FestiveTicket({ ticket, rows, cols }: TicketProps) {
  return (
    <div className="ticket-for-pdf" style={{
      width: 780, background: 'linear-gradient(135deg, #FFFEF5, #FFF9E6)',
      borderRadius: 6, display: 'flex', fontFamily: "'Inter', sans-serif",
      overflow: 'hidden', position: 'relative',
      border: '3px solid #C5961B',
      boxShadow: 'inset 0 0 0 2px #FFFEF5, inset 0 0 0 3px rgba(197,150,27,0.3)',
    }}>
      {/* Left sidebar */}
      <div style={{
        width: 72, background: 'linear-gradient(180deg, #C5961B, #8B6914)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '16px 8px', gap: 12, flexShrink: 0,
      }}>
        <img src="/hpym.jpg" alt="Logo" style={{
          width: 44, height: 44, borderRadius: '50%', objectFit: 'cover',
          border: '2px solid rgba(255,255,255,0.5)',
        }} />
        <VerticalText text="MUSICAL HOUSIE" color="rgba(255,255,255,0.8)" />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px 10px', borderBottom: '2px solid #C5961B',
          textAlign: 'center', background: 'rgba(197,150,27,0.06)',
        }}>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: '1.15rem', color: '#8B6914', letterSpacing: '0.18em',
            textTransform: 'uppercase', margin: 0,
          }}>
            ✦ Hari Prabodham ✦
          </h3>
        </div>

        {/* Grid */}
        <div style={{
          display: 'table', width: '100%', flex: 1, borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} style={{ display: 'table-row' }}>
              {Array.from({ length: cols }).map((_, c) => {
                const i = r * cols + c;
                const song = ticket.songs[i];
                if (!song) return <div key={c} style={{ display: 'table-cell' }} />;
                return (
                  <div key={c} style={{
                    display: 'table-cell', verticalAlign: 'middle', textAlign: 'center',
                    padding: '12px 4px 18px 4px', height: 'auto', boxSizing: 'border-box',
                    borderRight: c < cols - 1 ? '1px solid rgba(197,150,27,0.25)' : 'none',
                    borderBottom: r < rows - 1 ? '1px solid rgba(197,150,27,0.25)' : 'none',
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                      fontSize: '1.3rem', color: '#8B6914', display: 'block',
                    }}>
                      {song.id}
                    </span>
                    <span style={{
                      fontSize: '0.55rem', color: '#6B5410', fontWeight: 500,
                      lineHeight: 1.4, marginTop: 4, display: 'block', paddingBottom: 5,
                    }}>
                      {song.songName}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 20px', borderTop: '2px solid #C5961B',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'rgba(197,150,27,0.06)',
        }}>
          <span style={{ fontSize: '0.65rem', color: '#8B6914', fontWeight: 700, letterSpacing: '0.1em' }}>
            TICKET #{String(ticket.id).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Right decorative */}
      <div style={{
        width: 80, background: 'linear-gradient(180deg, rgba(197,150,27,0.08), rgba(197,150,27,0.15))',
        borderLeft: '2px solid rgba(197,150,27,0.3)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 12, gap: 8, flexShrink: 0,
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%',
          border: '2px solid rgba(197,150,27,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/hpym.jpg" alt="" style={{
            width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', opacity: 0.5,
          }} />
        </div>
        <VerticalText text="JAY SWAMINARAYAN" color="#B8960B" />
      </div>
    </div>
  );
}

/* ─────────── Ticket Renderer (picks design) ───────────── */

function TicketRenderer({ ticket, rows, cols, design }: TicketProps & { design: DesignType }) {
  switch (design) {
    case 'classic': return <ClassicTicket ticket={ticket} rows={rows} cols={cols} />;
    case 'royal':   return <RoyalTicket   ticket={ticket} rows={rows} cols={cols} />;
    case 'modern':  return <ModernTicket  ticket={ticket} rows={rows} cols={cols} />;
    case 'festive': return <FestiveTicket ticket={ticket} rows={rows} cols={cols} />;
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function TicketGenerator({ songs }: { songs: SongData[] }) {
  /* ── State ── */
  const [ticketCount, setTicketCount] = useState<number | ''>(10);
  const [gridIdx, setGridIdx]         = useState(1); // default 3×4
  const [design, setDesign]           = useState<DesignType>('classic');
  const [tickets, setTickets]         = useState<Ticket[]>([]);
  const [showViewer, setShowViewer]   = useState(false);
  const [isOpeningViewer, setIsOpeningViewer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const viewerRef                     = useRef<HTMLDivElement>(null);

  const grid = GRID_OPTIONS[gridIdx];
  const cellCount = grid.rows * grid.cols;

  /* ── Generate ── */
  const handleGenerate = useCallback(() => {
    if (songs.length < cellCount) return;
    const safeCount = ticketCount === '' ? 1 : ticketCount;
    const newTickets = generateTickets(songs, safeCount, cellCount);
    setTickets(newTickets);
    // Save to localStorage
    try {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify({
        tickets: newTickets, design, rows: grid.rows, cols: grid.cols,
      }));
    } catch { /* quota error — tickets are in memory anyway */ }
  }, [songs, ticketCount, cellCount, design, grid]);

  /* ── PDF Export ── */
  const exportPDF = async () => {
    if (!tickets.length) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Ensure viewer is open so tickets are rendered in DOM
      setShowViewer(true);

      // Wait for DOM to render
      await new Promise(r => setTimeout(r, 500));

      const ticketEls = viewerRef.current?.querySelectorAll('.ticket-for-pdf');
      if (!ticketEls || !ticketEls.length) { setIsExporting(false); return; }

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const ticketsPerPage = 2;
      const slotH = (pageH - margin * (ticketsPerPage + 1)) / ticketsPerPage;

      for (let i = 0; i < ticketEls.length; i++) {
        if (i > 0 && i % ticketsPerPage === 0) pdf.addPage();

        const canvas = await html2canvas(ticketEls[i] as HTMLElement, {
          scale: 2, useCORS: true, backgroundColor: null,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const aspect = canvas.width / canvas.height;
        const imgW = Math.min(pageW - margin * 2, slotH * aspect);
        const imgH = imgW / aspect;
        const posY = margin + (i % ticketsPerPage) * (slotH + margin);
        const posX = (pageW - imgW) / 2;

        pdf.addImage(imgData, 'PNG', posX, posY, imgW, Math.min(imgH, slotH));
      }

      pdf.save('hari-prabodham-tickets.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  /* ── Sample ticket for design preview ── */
  const sampleTicket: Ticket = {
    id: 1,
    songs: songs.slice(0, Math.min(6, songs.length)).map(s => s),
  };

  return (
    <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, marginTop: 10 }}>
        <TicketIcon size={24} style={{ color: 'var(--accent)' }} />
        <h2 style={{
          fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800,
          fontSize: '1.8rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0,
        }}>
          Ticket Generator
        </h2>
      </div>

      {/* ── Configuration Card ── */}
      <div className="glass" style={{ borderRadius: 18, padding: 28, marginBottom: 24 }}>

        {/* Row 1: Count + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Ticket Count */}
          <div>
            <label style={{
              display: 'block', fontSize: '0.78rem', fontWeight: 600,
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 8,
            }}>
              <Hash size={13} style={{ marginRight: 4, verticalAlign: '-2px' }} />
              Number of Tickets
            </label>
            <input
              type="number" min={1} max={200}
              value={ticketCount}
              onChange={e => {
                const val = e.target.value;
                if (val === '') setTicketCount('');
                else setTicketCount(Math.min(200, Number(val)));
              }}
              onBlur={() => {
                if (ticketCount === '' || ticketCount < 1) setTicketCount(1);
              }}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Grid Size */}
          <div>
            <label style={{
              display: 'block', fontSize: '0.78rem', fontWeight: 600,
              color: 'var(--text-secondary)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 8,
            }}>
              <LayoutGrid size={13} style={{ marginRight: 4, verticalAlign: '-2px' }} />
              Grid Size
            </label>
            <select
              value={gridIdx}
              onChange={e => setGridIdx(Number(e.target.value))}
              className="input"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              {GRID_OPTIONS.map((g, i) => (
                <option key={i} value={i}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation message */}
        {songs.length < cellCount && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
            color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            ⚠️ You need at least {cellCount} songs for a {grid.rows}×{grid.cols} grid. Currently have {songs.length}.
          </div>
        )}

        {/* Row 2: Design Selection */}
        <div>
          <label style={{
            display: 'block', fontSize: '0.78rem', fontWeight: 600,
            color: 'var(--text-secondary)', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: 12,
          }}>
            <Sparkles size={13} style={{ marginRight: 4, verticalAlign: '-2px' }} />
            Choose Ticket Design
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {DESIGNS.map(d => (
              <div
                key={d.key}
                onClick={() => setDesign(d.key)}
                style={{
                  cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
                  border: design === d.key
                    ? '2.5px solid var(--accent)'
                    : '1.5px solid var(--border)',
                  transition: 'all 0.2s', position: 'relative',
                  boxShadow: design === d.key ? '0 4px 16px var(--accent-glow)' : 'var(--shadow-sm)',
                  transform: design === d.key ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Color preview bar */}
                <div style={{
                  height: 8,
                  background: d.key === 'modern'
                    ? 'linear-gradient(135deg, #6c5ce7, #e84393)'
                    : d.headerBg,
                }} />
                {/* Preview body */}
                <div style={{
                  background: d.bg, padding: '14px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  {/* Mini grid */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3,
                    width: '100%', maxWidth: 90,
                  }}>
                    {[1,2,3,4,5,6].map(n => (
                      <div key={n} style={{
                        aspectRatio: '1.2', borderRadius: 3,
                        background: 'rgba(0,0,0,0.04)',
                        border: `1px solid ${d.accent}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.5rem', fontWeight: 700, color: d.accent,
                      }}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Label */}
                <div style={{
                  padding: '8px 10px', background: 'var(--bg-elevated)',
                  borderTop: '1px solid var(--border)',
                }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, textAlign: 'center' }}>
                    {d.name}
                  </p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: '2px 0 0', textAlign: 'center' }}>
                    {d.desc}
                  </p>
                </div>

                {/* Selected badge */}
                {design === d.key && (
                  <div style={{
                    position: 'absolute', top: 14, right: 6,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--accent)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={songs.length < cellCount}
            style={{ fontSize: '1rem', padding: '14px 40px' }}
          >
            <Sparkles size={17} />
            Generate {ticketCount} Ticket{Number(ticketCount) > 1 ? 's' : ''}
          </button>

          {tickets.length > 0 && (
            <span style={{
              fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              ✓ {tickets.length} tickets ready
            </span>
          )}
        </div>
      </div>

      {/* ── Generated Tickets Preview ── */}
      {tickets.length > 0 && (
        <div className="glass animate-fadeIn" style={{ borderRadius: 18, padding: 28 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20,
          }}>
            <div>
              <h3 style={{
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
                fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 4px',
              }}>
                Generated Tickets
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {tickets.length} tickets • {grid.rows}×{grid.cols} grid • {DESIGNS.find(d => d.key === design)?.name}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => {
                setIsOpeningViewer(true);
                // Allow React to paint the loading state before blocking main thread
                setTimeout(() => {
                  setShowViewer(true);
                  setIsOpeningViewer(false);
                }, 50);
              }} disabled={isOpeningViewer}>
                {isOpeningViewer ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Eye size={15} />}
                {isOpeningViewer ? 'Loading...' : 'View All'}
              </button>
              <button
                className="btn-primary"
                onClick={exportPDF}
                disabled={isExporting}
                style={{ padding: '10px 24px', fontSize: '0.875rem' }}
              >
                <Download size={15} />
                {isExporting ? 'Exporting…' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* First ticket preview */}
          <div style={{
            containerType: 'inline-size', width: '100%',
            display: 'flex', justifyContent: 'center',
            paddingBottom: 24, // Added padding to let shadow/border show
          }}>
            <div style={{
              width: 780,
              transform: 'scale(min(1, calc((100cqw - 32px) / 780)))',
              transformOrigin: 'top center',
              marginBottom: 'calc(280px * (min(1, calc((100cqw - 32px) / 780)) - 1))',
              borderRadius: 14,
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)', // Subtle shadow to highlight borders
            }}>
              <TicketRenderer ticket={tickets[0]} rows={grid.rows} cols={grid.cols} design={design} />
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
            Showing ticket 1 of {tickets.length} — click "View All" to see every ticket
          </p>
        </div>
      )}

      {/* ═══════ Viewer Modal ═══════ */}
      {showViewer && (
        <div className="modal-backdrop" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 24, width: '100%',
            maxWidth: 880, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            animation: 'modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Viewer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 28px', borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elevated)', flexShrink: 0,
              borderRadius: '24px 24px 0 0', zIndex: 10,
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700,
                  fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 2px',
                }}>
                  All Tickets ({tickets.length})
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {DESIGNS.find(d => d.key === design)?.name} • {grid.rows}×{grid.cols} grid
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn-primary"
                  onClick={exportPDF}
                  disabled={isExporting}
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  <Download size={14} />
                  {isExporting ? 'Exporting…' : 'Download PDF'}
                </button>
                <button className="icon-btn" onClick={() => setShowViewer(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Ticket list */}
            <div ref={viewerRef} style={{
              padding: '24px 0', overflowY: 'auto', flex: 1,
            }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{
                  containerType: 'inline-size', width: '100%',
                  display: 'flex', justifyContent: 'center',
                  paddingBottom: 24,
                }}>
                  <div style={{
                    width: 780,
                    transform: 'scale(min(1, calc((100cqw - 32px) / 780)))',
                    transformOrigin: 'top center',
                    marginBottom: 'calc(280px * (min(1, calc((100cqw - 32px) / 780)) - 1))',
                    borderRadius: 14,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  }}>
                    <TicketRenderer ticket={ticket} rows={grid.rows} cols={grid.cols} design={design} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
