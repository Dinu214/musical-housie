import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Square, Edit2, Upload, X, Check, Music2, AlertCircle, Download, Ticket } from 'lucide-react';
import { saveAudioFile } from './db';
import TicketGenerator from './TicketGenerator';

export interface SongData {
  id: number;
  songName: string;
  fileName: string;
  customBlob?: string;   // runtime blob URL for playback
  hasCustomAudio?: boolean; // flag: true if audio is stored in IndexedDB
}

interface AdminPanelProps {
  songs: SongData[];
  onSongsChange: (songs: SongData[]) => void;
}

interface EditState {
  song: SongData;
  newNumber: number;
  newName: string;
  file: File | null;
  previewUrl: string | null;
}

/* ── Constants ── */
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function AdminPanel({ songs, onSongsChange }: AdminPanelProps) {
  const [adminTab, setAdminTab]       = useState<'songs' | 'tickets'>('songs');
  const [search, setSearch]           = useState('');
  const [playingId, setPlayingId]     = useState<number | null>(null);
  const [editState, setEditState]     = useState<EditState | null>(null);
  const [saveStatus, setSaveStatus]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [numConflict, setNumConflict] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const audioRef                      = useRef<HTMLAudioElement | null>(null);
  const fileInputRef                  = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const filtered = songs.filter(s =>
    s.songName.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search)
  );

  const playSong = (song: SongData) => {
    if (playingId === song.id) { audioRef.current?.pause(); setPlayingId(null); return; }
    audioRef.current?.pause();
    const audio = new Audio(song.customBlob ?? `/songs/${song.fileName}`);
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(song.id);
  };

  const openEdit = (song: SongData) => {
    setEditState({ song, newNumber: song.id, newName: song.songName, file: null, previewUrl: null });
    setNumConflict(false);
    setSaveStatus('idle');
    setUploadError(null);
  };

  const closeEdit = () => {
    if (editState?.previewUrl) URL.revokeObjectURL(editState.previewUrl);
    setEditState(null);
    setSaveStatus('idle');
    setUploadError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editState) return;

    // ── File size validation ──
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(
        `File too large (${formatFileSize(file.size)}). Maximum allowed size is ${formatFileSize(MAX_FILE_SIZE)}.`
      );
      // Reset the input so user can try again
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // ── File type validation ──
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/mp3', 'video/mp4', 'audio/ogg', 'audio/wav'];
    if (!validTypes.some(t => file.type.includes(t.split('/')[1])) && !file.name.match(/\.(mp3|m4a|mp4|ogg|wav)$/i)) {
      setUploadError('Invalid file format. Please upload MP3, M4A, MP4, OGG, or WAV.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadError(null);
    if (editState.previewUrl) URL.revokeObjectURL(editState.previewUrl);
    setEditState({ ...editState, file, previewUrl: URL.createObjectURL(file) });
  };

  const handleNumberChange = (val: number) => {
    if (!editState) return;
    setNumConflict(val !== editState.song.id && songs.some(s => s.id === val));
    setEditState({ ...editState, newNumber: val });
  };

  const saveEdit = async () => {
    if (!editState || numConflict) return;
    setSaveStatus('saving');
    try {
      const { song, newNumber, newName, file } = editState;
      const padded = String(newNumber).padStart(2, '0');
      let updatedFileName = song.fileName;
      let updatedBlob = song.customBlob;
      let hasCustom = song.hasCustomAudio || false;

      if (file) {
        const ext = file.name.split('.').pop() ?? 'mp3';
        updatedFileName = `${padded}.${newName.replace(/[^a-zA-Z0-9 ]/g, '')}.${ext}`;

        // Save to IndexedDB for persistent storage
        try {
          const blobUrl = await saveAudioFile(newNumber, file);
          updatedBlob = blobUrl;
          hasCustom = true;
        } catch (dbErr) {
          console.error('IndexedDB save failed, falling back to blob URL:', dbErr);
          // Fallback: keep the blob URL in memory (won't persist across refresh)
          if (song.customBlob) URL.revokeObjectURL(song.customBlob);
          updatedBlob = editState.previewUrl ?? undefined;
          hasCustom = false;
        }
      }

      const updated: SongData = {
        id: newNumber,
        songName: newName,
        fileName: updatedFileName,
        customBlob: updatedBlob,
        hasCustomAudio: hasCustom,
      };
      const newSongs = songs.map(s => {
        if (s.id === song.id) return updated;
        if (s.id === newNumber && newNumber !== song.id) return { ...s, id: song.id };
        return s;
      }).sort((a, b) => a.id - b.id);

      onSongsChange(newSongs);
      setSaveStatus('saved');
      setTimeout(closeEdit, 700);
    } catch {
      setSaveStatus('error');
    }
  };

  const customCount = songs.filter(s => s.hasCustomAudio || s.customBlob).length;

  return (
    <>
      {/* ── Sub-tab bar ── */}
      <div style={{
        position: 'relative', maxWidth: 860, margin: '0 auto',
        padding: '20px 24px 0', display: 'flex', gap: 4,
      }}>
        <button
          onClick={() => setAdminTab('songs')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 22px', borderRadius: '12px 12px 0 0',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            border: '1px solid var(--border)', borderBottom: 'none',
            background: adminTab === 'songs' ? 'var(--bg-card)' : 'transparent',
            color: adminTab === 'songs' ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'all 0.2s',
          }}
        >
          <Music2 size={15} /> Songs
        </button>
        <button
          onClick={() => setAdminTab('tickets')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 22px', borderRadius: '12px 12px 0 0',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            border: '1px solid var(--border)', borderBottom: 'none',
            background: adminTab === 'tickets' ? 'var(--bg-card)' : 'transparent',
            color: adminTab === 'tickets' ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'all 0.2s',
          }}
        >
          <Ticket size={15} /> Tickets
        </button>
      </div>

      {/* ── Tickets Tab ── */}
      {adminTab === 'tickets' && <TicketGenerator songs={songs} />}

      {/* ── Songs Tab ── */}
      {adminTab === 'songs' && (
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, marginTop: 10, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Music2 size={26} style={{ color: 'var(--accent)' }} /> Song Manager
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6 }}>
                {songs.length} songs
                {customCount > 0 && <span style={{ marginLeft: 8, color: 'var(--success)', fontWeight: 600 }}>· {customCount} custom</span>}
              </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                className="input"
                style={{ paddingLeft: 38, width: 260 }}
                placeholder="Search name or number…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total Songs', value: songs.length, color: 'var(--accent)' },
              { label: 'Custom Uploads', value: customCount, color: 'var(--success)' },
              { label: 'Showing', value: filtered.length, color: 'var(--accent-2)' },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: stat.color, lineHeight: 1, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="glass" style={{ borderRadius: 18, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 80px 88px', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              {['#', 'Song', 'Format', 'Actions'].map(h => (
                <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ maxHeight: '62vh', overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>No songs match your search.</div>
              )}
              {filtered.map(song => (
                <div
                  key={song.id}
                  className={`song-row ${playingId === song.id ? 'is-playing' : ''}`}
                >
                  {/* Number */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 9, fontSize: '0.8rem', fontWeight: 700,
                    background: playingId === song.id ? 'linear-gradient(135deg,var(--accent),var(--accent-2))' : 'rgba(0,0,0,0.05)',
                    color: playingId === song.id ? '#fff' : 'var(--text-secondary)',
                    boxShadow: playingId === song.id ? '0 2px 10px var(--accent-glow)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    {song.id}
                  </span>

                  {/* Info */}
                  <div style={{ minWidth: 0, padding: '0 12px' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                      {song.songName}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 5 }}>
                      {(song.hasCustomAudio || song.customBlob) && <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.65rem' }}>● CUSTOM</span>}
                      {song.fileName}
                    </p>
                  </div>

                  {/* Format badge */}
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontFamily: 'monospace', letterSpacing: '0.04em', alignSelf: 'center' }}>
                    {song.fileName.split('.').pop()?.toUpperCase()}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button className={`icon-btn ${playingId === song.id ? 'active' : ''}`} onClick={() => playSong(song)} title={playingId === song.id ? 'Stop' : 'Play'}>
                      {playingId === song.id ? <Square size={14} /> : <Play size={14} />}
                    </button>
                    <button className="icon-btn" onClick={() => openEdit(song)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Modal */}
          {editState && (
            <div className="modal-backdrop">
              <div className="modal">
                {/* Modal header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 0' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>
                      Edit Song
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 3 }}>#{editState.song.id} · {editState.song.songName}</p>
                  </div>
                  <button className="icon-btn" onClick={closeEdit}><X size={16} /></button>
                </div>

                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Song Number</label>
                    <input
                      type="number" min={1} max={60}
                      value={editState.newNumber}
                      onChange={e => handleNumberChange(Number(e.target.value))}
                      className={`input ${numConflict ? 'error' : ''}`}
                    />
                    {numConflict && (
                      <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <AlertCircle size={13} /> Number {editState.newNumber} is taken — saving will swap both songs.
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Song Name</label>
                    <input
                      type="text"
                      value={editState.newName}
                      onChange={e => setEditState({ ...editState, newName: e.target.value })}
                      className="input"
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Replace Audio File
                      <span style={{ fontSize: '0.68rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
                        (max {formatFileSize(MAX_FILE_SIZE)})
                      </span>
                    </label>
                    <div className={`upload-zone ${editState.file ? 'has-file' : ''}`} onClick={() => fileInputRef.current?.click()}>
                      {editState.file ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--success)' }}>
                          <Check size={18} />
                          <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block' }}>{editState.file.name}</span>
                            <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>{formatFileSize(editState.file.size)}</span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)' }}>
                          <Upload size={28} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                          <p style={{ fontSize: '0.875rem', marginBottom: 4 }}>Click to upload MP3 / M4A / MP4</p>
                          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                            Saves as <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 4 }}>
                              {String(editState.newNumber).padStart(2,'0')}.{editState.newName.replace(/[^a-zA-Z0-9 ]/g,'')}.ext
                            </code>
                          </p>
                          <p style={{ fontSize: '0.68rem', opacity: 0.5, marginTop: 4 }}>
                            File stored in browser storage (IndexedDB) — persists across refreshes
                          </p>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="audio/*,video/mp4" style={{ display: 'none' }} onChange={handleFileSelect} />

                    {/* Upload Error */}
                    {uploadError && (
                      <div style={{
                        marginTop: 10, padding: '10px 14px', borderRadius: 10,
                        background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
                        color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        {uploadError}
                      </div>
                    )}
                  </div>

                  {/* Audio preview */}
                  {editState.previewUrl && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Preview</label>
                      <audio controls src={editState.previewUrl} style={{ width: '100%', borderRadius: 10, height: 40 }} />
                    </div>
                  )}

                  {/* Current file */}
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Current: </span>{editState.song.fileName}
                    {editState.song.hasCustomAudio && (
                      <span style={{ marginLeft: 8, color: 'var(--success)', fontWeight: 600, fontSize: '0.7rem' }}>● Stored in IndexedDB</span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '0 24px 24px' }}>
                  <button className="btn-ghost" onClick={closeEdit}>Cancel</button>
                  <button
                    onClick={saveEdit}
                    disabled={saveStatus === 'saving' || !editState.newName.trim()}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '10px 22px', borderRadius: 99, fontWeight: 600, fontSize: '0.875rem',
                      border: 'none', cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                      background: saveStatus === 'saved' ? 'var(--success)' : saveStatus === 'error' ? 'var(--danger)' : 'linear-gradient(135deg,var(--accent),var(--accent-2))',
                      color: '#fff', opacity: saveStatus === 'saving' ? 0.7 : 1, transition: 'opacity 0.15s',
                      boxShadow: '0 4px 16px var(--accent-glow)',
                    }}
                  >
                    {saveStatus === 'saving' && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                    {saveStatus === 'saved'  && <Check size={15} />}
                    {saveStatus === 'error'  && <AlertCircle size={15} />}
                    {editState.file && saveStatus === 'idle' && <Download size={15} />}
                    {saveStatus === 'idle'   ? (editState.file ? 'Save & Store' : 'Save Changes') :
                     saveStatus === 'saving' ? 'Saving…' :
                     saveStatus === 'saved'  ? 'Saved!' : 'Error'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
