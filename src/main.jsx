import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {io} from 'socket.io-client';
import './style.css';

const socket=io();
const WORDS=['APPLE','ROCKET','BANANA','TIGER','OCEAN','PIZZA','GUITAR','CASTLE','SUNSET','THUNDER','COFFEE','DRAGON','PLANET','COOKIE','BASKET','JUNGLE','RAINBOW','PENGUIN','MOUNTAIN','POPCORN'];

function App(){
 const [screen,setScreen]=useState('home'),[name,setName]=useState(''),[room,setRoom]=useState(''),[players,setPlayers]=useState([]),[hostId,setHostId]=useState(null),[me,setMe]=useState(null),[word,setWord]=useState(''),[round,setRound]=useState(0),[total,setTotal]=useState(10),[time,setTime]=useState(5),[scores,setScores]=useState({}),[input,setInput]=useState(''),[message,setMessage]=useState(''),[winner,setWinner]=useState(null),[roundResults,setRoundResults]=useState([]),[error,setError]=useState('');
 const isHost=me?.id===hostId;
 useEffect(()=>{
  socket.on('connect',()=>setMe({id:socket.id}));
  socket.on('roomCreated',d=>{setRoom(d.code);setHostId(d.hostId);setScreen('lobby');});
  socket.on('roomState',d=>{setPlayers(d.players);setHostId(d.hostId);setScores(d.scores||{});if(d.status==='lobby')setScreen('lobby');});
  socket.on('gameStarted',d=>{setScreen('game');setWord(d.word);setRound(d.round);setTotal(d.total);setTime(d.timeLimit);setInput('');setMessage('');setWinner(null);});
  socket.on('tick',t=>setTime(t));
  socket.on('answerResult',d=>{setMessage(d.message);});
  socket.on('scoreUpdate',d=>setScores(d.scores));
  socket.on('roundResult',d=>{setWinner(d.winner);setRoundResults(d.results);setScores(d.scores);setScreen('round');});
  socket.on('gameAgain',d=>{setScreen('game');setWord(d.word);setRound(d.round);setTotal(d.total);setTime(d.timeLimit);setInput('');setMessage('');});
  socket.on('errorMessage',m=>setError(m));
  socket.on('disconnect',()=>setError('Connection lost. Refresh to reconnect.'));
  return()=>socket.removeAllListeners();
 },[]);
 const create=()=>{if(!name.trim())return setError('Enter your name first.');socket.emit('createRoom',{name:name.trim()});};
 const join=()=>{if(!name.trim()||!room.trim())return setError('Enter your name and room code.');socket.emit('joinRoom',{name:name.trim(),code:room.trim().toUpperCase()});};
 const start=()=>socket.emit('startGame');
 const submit=e=>{e?.preventDefault();if(!input.trim()||!word)return;socket.emit('submitAnswer',{answer:input.trim()});setInput('');};
 const again=()=>socket.emit('playAgain');
 const leave=()=>{socket.disconnect();window.location.reload();};
 return <div className="app"><header><div className="brand">⚡ WORD RUSH</div>{room&&<div className="roomBadge">ROOM <b>{room}</b></div>}</header>
 {error&&<div className="toast" onClick={()=>setError('')}>{error} ×</div>}
 {screen==='home'&&<main className="card hero"><div className="emoji">⚡</div><h1>Word Rush</h1><p>Think fast. Type faster. Beat everyone in the room.</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" maxLength="16"/><button onClick={create}>Create a room</button><div className="divider">OR JOIN A ROOM</div><div className="joinRow"><input value={room} onChange={e=>setRoom(e.target.value.toUpperCase())} placeholder="ROOM CODE" maxLength="4"/><button className="secondary" onClick={join}>Join</button></div><small>No login. No app. Works on phone or laptop.</small></main>}
 {screen==='lobby'&&<main className="card"><div className="eyebrow">WAITING ROOM</div><h2>Room <span>{room}</span></h2><p>Share the code with your friends.</p><div className="code">{room}</div><div className="players">{players.map((p,i)=><div className="player" key={p.id}><span className="avatar">{p.name[0]?.toUpperCase()}</span><span>{p.name}{p.id===hostId&&<em> HOST</em>}</span></div>)}</div>{isHost?<button onClick={start} disabled={players.length<1}>Start game</button>:<div className="waiting">Waiting for the host to start…</div>}<button className="linkBtn" onClick={leave}>Leave room</button></main>}
 {screen==='game'&&<main className="game"><div className="stats"><span>Round {round}/{total}</span><span className={time<=2?'danger':''}>⏱ {time}s</span></div><div className="card prompt"><div className="eyebrow">TYPE THIS WORD</div><div className="word">{word}</div><form onSubmit={submit}><input autoFocus value={input} onChange={e=>setInput(e.target.value)} placeholder="Type the word…" autoComplete="off"/><button>SUBMIT</button></form><div className="message">{message||'First correct answer gets the most points!'}</div></div><div className="scoreStrip">{players.map(p=><div key={p.id}><b>{scores[p.id]||0}</b><span>{p.name}</span></div>)}</div></main>}
 {screen==='round'&&<main className="card results"><div className="emoji">🏆</div><div className="eyebrow">ROUND COMPLETE</div><h2>{winner?.name||'Great game!'}</h2><p>{winner?'was the fastest this round!':'Everyone played.'}</p><div className="leaderboard">{roundResults.map((p,i)=><div className="rank" key={p.id}><strong>{i+1}</strong><span>{p.name}</span><b>{p.score}</b></div>)}</div>{isHost&&<button onClick={again}>Play again</button>}{!isHost&&<div className="waiting">Waiting for the host to play again…</div>}<button className="linkBtn" onClick={leave}>Leave room</button></main>}
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
