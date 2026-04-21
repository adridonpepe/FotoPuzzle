// app.js

const translations = {
    es: {
        desc_main: "Transforma tus fotografías en puzles y desafía tu mente.",
        btn_upload: "Subir Fotografía",
        btn_capture: "Hacer Foto",
        btn_history: "Ver Historial de Puzles",
        demo_gallery: "Galería Demo",
        demo_1: "Picnic Familiar",
        demo_2: "Parque Infantil",
        demo_3: "Dinosaurios",
        config_title: "Configura tu Puzle",
        config_diff: "Selecciona la Dificultad",
        diff_easy: "Fácil",
        pieces_12: "12 piezas",
        diff_medium: "Medio",
        pieces_24: "24 piezas",
        diff_hard: "Difícil",
        pieces_48: "48 piezas",
        btn_generate: "Generar Puzle",
        btn_view_photo: "Ver Foto",
        tray_title: "Bandeja",
        btn_shuffle: "Mezclar",
        win_title: "¡Completado!",
        win_desc: "Has resuelto el puzle correctamente.",
        win_time: "Tiempo:",
        btn_replay: "Volver a jugar (Mismo)",
        btn_change_diff: "Cambiar dificultad",
        btn_new_photo: "Nueva foto",
        history_title: "Historial",
        history_empty: "Aún no has completado ningún puzle. ¡Empieza a jugar!",
        confirm_quit: "¿Seguro que quieres abandonar este puzle?",
        pieces: "pz"
    },
    en: {
        desc_main: "Transform your photos into puzzles and challenge your mind.",
        btn_upload: "Upload Photo",
        btn_capture: "Take Photo",
        btn_history: "View Puzzle History",
        demo_gallery: "Demo Gallery",
        demo_1: "Family Picnic",
        demo_2: "Playground",
        demo_3: "Dinosaurs",
        config_title: "Configure your Puzzle",
        config_diff: "Select Difficulty",
        diff_easy: "Easy",
        pieces_12: "12 pieces",
        diff_medium: "Medium",
        pieces_24: "24 pieces",
        diff_hard: "Hard",
        pieces_48: "48 pieces",
        btn_generate: "Generate Puzzle",
        btn_view_photo: "View Photo",
        tray_title: "Tray",
        btn_shuffle: "Shuffle",
        win_title: "Completed!",
        win_desc: "You have successfully solved the puzzle.",
        win_time: "Time:",
        btn_replay: "Play Again (Same)",
        btn_change_diff: "Change Difficulty",
        btn_new_photo: "New Photo",
        history_title: "History",
        history_empty: "You haven't completed any puzzles yet. Start playing!",
        confirm_quit: "Are you sure you want to abandon this puzzle?",
        pieces: "pcs"
    },
    fr: {
        desc_main: "Transformez vos photos en puzzles et mettez votre esprit au défi.",
        btn_upload: "Téléverser une Photo",
        btn_capture: "Prendre une Photo",
        btn_history: "Voir l'historique des puzzles",
        demo_gallery: "Galerie Démo",
        demo_1: "Pique-nique en Famille",
        demo_2: "Aire de jeux",
        demo_3: "Dinosaures",
        config_title: "Configurez votre Puzzle",
        config_diff: "Sélectionnez la difficulté",
        diff_easy: "Facile",
        pieces_12: "12 pièces",
        diff_medium: "Moyen",
        pieces_24: "24 pièces",
        diff_hard: "Difficile",
        pieces_48: "48 pièces",
        btn_generate: "Générer le Puzzle",
        btn_view_photo: "Voir la Photo",
        tray_title: "Plateau",
        btn_shuffle: "Mélanger",
        win_title: "Terminé!",
        win_desc: "Vous avez résolu le puzzle avec succès.",
        win_time: "Temps:",
        btn_replay: "Rejouer (Le même)",
        btn_change_diff: "Changer de Difficulté",
        btn_new_photo: "Nouvelle Photo",
        history_title: "Historique",
        history_empty: "Vous n'avez pas encore terminé de puzzle. Commencez à jouer !",
        confirm_quit: "Êtes-vous sûr de vouloir abandonner ce puzzle ?",
        pieces: "pcs"
    }
};

let currentLang = localStorage.getItem('puzzleLang') || 'es';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('puzzleLang', lang);
    const t = translations[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerText = t[key];
        }
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === lang) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('text-slate-400', 'hover:text-white');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('text-slate-400', 'hover:text-white');
        }
    });

    const historyModal = document.getElementById('history-modal');
    if (historyModal && !historyModal.classList.contains('hidden')) {
        loadHistory();
    }
}// --- State and Config ---
const state = {
    originalImage: null, // HTMLImageElement
    processedImage: null, // Cropped canvas
    difficulty: 12, // default
    piecesLocked: 0,
    totalPieces: 0,
    piecesData: [] // Store data for pieces if needed
};

const screens = {
    upload: document.getElementById('screen-upload'),
    config: document.getElementById('screen-config'),
    game: document.getElementById('screen-game')
};

// --- DOM Elements ---
const uploadInput = document.getElementById('uploadFile');
const captureInput = document.getElementById('captureFile');
const previewImg = document.getElementById('img-preview');
const loader = document.getElementById('preview-loader');
const btnGenerate = document.getElementById('btn-generate');
const btnBackConfig = document.getElementById('btn-back-config');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRestart = document.getElementById('btn-restart');

const diffBtns = document.querySelectorAll('.difficulty-btn');

const boardContainer = document.getElementById('board-container');
const puzzleBoard = document.getElementById('puzzle-board');
const tray = document.getElementById('tray');
const progressText = document.getElementById('progress-text');

const winModal = document.getElementById('win-modal');
const winModalContent = document.getElementById('win-modal-content');
const winTimeText = document.getElementById('win-time-text');

const gameTimer = document.getElementById('game-timer');
const btnTogglePreview = document.getElementById('btn-toggle-preview');
const boardPreviewLayer = document.getElementById('board-preview-layer');
const iconEye = document.getElementById('icon-eye');

const historyModal = document.getElementById('history-modal');
const historyModalContent = document.getElementById('history-modal-content');
const btnShowHistory = document.getElementById('btn-show-history');
const btnCloseHistory = document.getElementById('btn-close-history');
const historyList = document.getElementById('history-list');

let timerInterval = null;
let secondsElapsed = 0;
let previewVisible = false;

// --- Navigation ---
function showScreen(screenKey) {
    Object.values(screens).forEach(s => {
        s.classList.add('opacity-0');
        setTimeout(() => s.classList.add('hidden'), 300); // Wait for transition
    });
    
    setTimeout(() => {
        screens[screenKey].classList.remove('hidden');
        // prompt reflow
        void screens[screenKey].offsetWidth;
        screens[screenKey].classList.remove('opacity-0');
    }, 300);
}

// --- Screen 1: Upload ---
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            state.originalImage = img;
            setupConfigScreen();
            showScreen('config');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
}

uploadInput.addEventListener('change', handleImageSelect);
captureInput.addEventListener('change', handleImageSelect);



// --- Screen 2: Config ---
function setupConfigScreen() {
    previewImg.style.backgroundImage = `url(${state.originalImage.src})`;
}

btnBackConfig.addEventListener('click', () => showScreen('upload'));

diffBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        diffBtns.forEach(b => {
            b.classList.remove('active-diff', 'border-blue-500', 'bg-slate-700');
            b.classList.add('border-slate-700');
        });
        targetBtn.classList.add('active-diff', 'border-blue-500', 'bg-slate-700');
        targetBtn.classList.remove('border-slate-700');
        state.difficulty = parseInt(targetBtn.dataset.pieces);
    });
});

btnGenerate.addEventListener('click', () => {
    initGame();
    showScreen('game');
});

// --- Screen 3: Game Logic ---
function initGame() {
    state.piecesLocked = 0;
    state.totalPieces = state.difficulty;
    updateProgress();
    
    Array.from(puzzleBoard.querySelectorAll('.drop-target, .puzzle-piece')).forEach(el => el.remove());
    tray.innerHTML = '';
    puzzleBoard.classList.remove('win-anim');
    winModal.classList.add('hidden', 'opacity-0');
    
    // Reset Timer
    clearInterval(timerInterval);
    secondsElapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);

    // Reset Preview
    previewVisible = false;
    boardPreviewLayer.classList.remove('opacity-50');
    boardPreviewLayer.classList.add('opacity-0');
    iconEye.setAttribute('data-lucide', 'eye');
    lucide.createIcons();

    // 1. Determine Grid sizes based on aspect ratio of the image
    let rows, cols;
    const isPortrait = state.originalImage.height > state.originalImage.width;
    
    if (state.difficulty === 12) {
        rows = isPortrait ? 4 : 3;
        cols = isPortrait ? 3 : 4;
    } else if (state.difficulty === 24) {
        rows = isPortrait ? 6 : 4;
        cols = isPortrait ? 4 : 6;
    } else { // 48
        rows = isPortrait ? 8 : 6;
        cols = isPortrait ? 6 : 8;
    }
    
    // Target ratio (e.g. 3:4 = 0.75 or 4:3 = 1.33)
    const targetRatio = cols / rows;
    
    // Crop image via Canvas to fit perfect proportional ratio
    const cropCanvas = document.createElement('canvas');
    const ctx = cropCanvas.getContext('2d');
    
    const imgRatio = state.originalImage.width / state.originalImage.height;
    
    let sx = 0, sy = 0, sWidth = state.originalImage.width, sHeight = state.originalImage.height;
    
    if (imgRatio > targetRatio) {
        // Image is wider than needed, crop width
        sWidth = sHeight * targetRatio;
        sx = (state.originalImage.width - sWidth) / 2;
    } else {
        // Image is taller than needed, crop height
        sHeight = sWidth / targetRatio;
        sy = (state.originalImage.height - sHeight) / 2;
    }
    
    cropCanvas.width = sWidth;
    cropCanvas.height = sHeight;
    ctx.drawImage(state.originalImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    
    const croppedDataUrl = cropCanvas.toDataURL();
    boardPreviewLayer.style.backgroundImage = `url(${croppedDataUrl})`;
    
    // Calculate sizing for the board based on available space
    // Let's use CSS grid and percentages for responsive piece sizes.
    // The board ratio is defined by targetRatio.
    
    // Maximize board size inside container but respect ratio
    // This is handled by CSS aspect-ratio on the board
    puzzleBoard.style.aspectRatio = `${cols} / ${rows}`;
    puzzleBoard.className = `relative outline-4 outline-dashed outline-slate-700/50 rounded-lg overflow-hidden bg-black/20 shadow-inner grid`;
    puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // Set max height/width for responsiveness
    puzzleBoard.style.maxWidth = '100%';
    puzzleBoard.style.maxHeight = '100%';
    // Trick to respect aspect ratio bound by height or width
    puzzleBoard.style.height = '100%';
    if (isPortrait) {
        puzzleBoard.style.height = '100%';
        puzzleBoard.style.width = 'auto'; // Width based on aspect ratio
    } else {
        puzzleBoard.style.width = '100%';
        puzzleBoard.style.height = 'auto'; // Height based on aspect ratio
    }

    const pieces = [];
    const piecePxW = sWidth / cols;
    const piecePxH = sHeight / rows;

    // Generate puzzle cells and pieces
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            
            // 1. Create drop target
            const dropTarget = document.createElement('div');
            dropTarget.className = `drop-target border border-slate-700/30 flex items-center justify-center relative`;
            dropTarget.dataset.index = index;
            dropTarget.id = `target-${index}`;
            puzzleBoard.appendChild(dropTarget);
            
            // 2. Extract Piece image
            const pCanvas = document.createElement('canvas');
            pCanvas.width = piecePxW;
            pCanvas.height = piecePxH;
            const pCtx = pCanvas.getContext('2d');
            pCtx.drawImage(cropCanvas, c * piecePxW, r * piecePxH, piecePxW, piecePxH, 0, 0, piecePxW, piecePxH);
            
            // 3. Create Piece DOM Element
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece bg-cover bg-center absolute rounded-sm sm:rounded-md origin-center';
            // We use standard tray size on init. Responsive sizes via CSS if absolute or we just let it be a fixed relative size
            // For the tray, pieces will just be blocks. Let's make them roughly the size of the board cell, but we'll use a fixed size logic for simplicity in tray:
            piece.style.backgroundImage = `url(${pCanvas.toDataURL()})`;
            
            // We will insert piece into tray as position relative first
            piece.dataset.index = index;
            piece.id = `piece-${index}`;
            
            // Setup Drag Events
            setupDrag(piece, dropTarget);
            
            pieces.push(piece);
        }
    }
    
    // Setup tray pieces styling
    setupTrayLayout(pieces, isPortrait);
    
    // Shuffle pieces and add to tray
    pieces.sort(() => Math.random() - 0.5).forEach(p => tray.appendChild(p));
}

function updateProgress() {
    progressText.innerText = `${state.piecesLocked} / ${state.totalPieces}`;
    if(state.piecesLocked === state.totalPieces && state.totalPieces > 0) {
        handleWin();
    }
}

function updateTimerDisplay() {
    const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const s = (secondsElapsed % 60).toString().padStart(2, '0');
    gameTimer.innerText = `${m}:${s}`;
}

btnTogglePreview.addEventListener('click', () => {
    previewVisible = !previewVisible;
    if(previewVisible) {
        boardPreviewLayer.classList.replace('opacity-0', 'opacity-50');
        iconEye.setAttribute('data-lucide', 'eye-off');
    } else {
        boardPreviewLayer.classList.replace('opacity-50', 'opacity-0');
        iconEye.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
});

// --- Drag and Drop Logic --- (Mouse + Touch)
let activePiece = null;
let initialX = 0, initialY = 0;
let currentX = 0, currentY = 0;

function setupDrag(piece, targetCell) {
    piece.addEventListener('mousedown', dragStart, {passive: false});
    piece.addEventListener('touchstart', dragStart, {passive: false});
}

function dragStart(e) {
    if (e.target.classList.contains('piece-placed')) return; // locked
    e.preventDefault(); // Prevent scrolling on touch
    
    activePiece = e.target;
    activePiece.classList.add('piece-dragging');
    
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    } else {
        initialX = e.clientX;
        initialY = e.clientY;
    }

    // If piece is in tray, we need to extract it to body to easily drag over everything
    const rect = activePiece.getBoundingClientRect();
    
    // Before changing parent, lock its current visual position
    activePiece.style.width = rect.width + 'px';
    activePiece.style.height = rect.height + 'px';
    activePiece.style.top = rect.top + 'px';
    activePiece.style.left = rect.left + 'px';
    activePiece.style.position = 'fixed'; // Fixed relative to viewport is better for dragging across containers
    
    document.body.appendChild(activePiece);

    document.addEventListener('mousemove', dragMove, {passive: false});
    document.addEventListener('touchmove', dragMove, {passive: false});
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
}

function dragMove(e) {
    if (!activePiece) return;
    e.preventDefault();
    
    let clientX, clientY;
    if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const dx = clientX - initialX;
    const dy = clientY - initialY;
    
    // Use Matrix Transform or Left/Top. Left/Top is easier given our 'fixed' state
    const currentTop = parseFloat(activePiece.style.top) || 0;
    const currentLeft = parseFloat(activePiece.style.left) || 0;
    
    activePiece.style.top = (currentTop + dy) + "px";
    activePiece.style.left = (currentLeft + dx) + "px";
    
    initialX = clientX;
    initialY = clientY;
}

function dragEnd(e) {
    if (!activePiece) return;

    // Remove event listeners
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);

    activePiece.classList.remove('piece-dragging');
    
    // Check Snap Collision
    const pieceId = activePiece.dataset.index;
    const targetCell = document.getElementById(`target-${pieceId}`);
    
    const pRect = activePiece.getBoundingClientRect();
    const tRect = targetCell.getBoundingClientRect();
    
    // Define centers
    const pCenter = { x: pRect.left + pRect.width/2, y: pRect.top + pRect.height/2 };
    const tCenter = { x: tRect.left + tRect.width/2, y: tRect.top + tRect.height/2 };
    
    const distance = Math.hypot(pCenter.x - tCenter.x, pCenter.y - tCenter.y);
    const snapTolerance = 40; // px
    
    if (distance < snapTolerance) {
        // SNAP SUCCESS!
        targetCell.appendChild(activePiece);
        activePiece.style.position = 'absolute';
        activePiece.style.top = '0';
        activePiece.style.left = '0';
        activePiece.style.width = '100%';
        activePiece.style.height = '100%';
        activePiece.classList.add('piece-placed', 'snap-anim');
        setTimeout(() => activePiece.classList.remove('snap-anim'), 400);
        
        state.piecesLocked++;
        updateProgress();
    } else {
        // SNAP FAILED. Return to tray
        tray.appendChild(activePiece);
        activePiece.style.position = 'relative';
        activePiece.style.top = 'unset';
        activePiece.style.left = 'unset';
        // Needs a fixed size inside Tray so it doesn't collapse
        // Usually, in tray, we want grid layout sizing
        activePiece.style.width = '80px';
        activePiece.style.height = '80px';
    }

    activePiece = null;
}

// Helpers
function setupTrayLayout(pieces, isPortrait) {
    // Determine size for tray pieces based on screen and orientation
    // A flex wrap context is easiest.
    pieces.forEach(p => {
        p.style.position = 'relative';
        
        // Dynamic tray size? Let's use a nice default:
        p.style.width = '80px';
        p.style.height = '80px';
        if(window.innerWidth < 768) {
             p.style.width = '64px';
             p.style.height = '64px';
        }
        
        // Remove random rotation for a cleaner visual dragging experience
        p.style.transform = `none`;
    });
}

// Win State
function handleWin() {
    clearInterval(timerInterval);
    puzzleBoard.classList.add('win-anim');
    winTimeText.innerText = gameTimer.innerText;
    
    // Generar miniatura reducida para no saturar localStorage
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 100;
    tCanvas.height = 100 * (state.originalImage.height / state.originalImage.width);
    tCanvas.getContext('2d').drawImage(state.originalImage, 0, 0, tCanvas.width, tCanvas.height);
    const thumbDataUrl = tCanvas.toDataURL('image/jpeg', 0.4);
    
    // Save to History
    saveToHistory(state.totalPieces, secondsElapsed, thumbDataUrl);
    
    // Fire Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // Show Modal
    winModal.classList.remove('hidden');
    // Triger transition
    setTimeout(() => {
        winModal.classList.remove('opacity-0');
        winModalContent.classList.remove('scale-95');
        winModalContent.classList.add('scale-100');
    }, 100);
}

// Controls
btnShuffle.addEventListener('click', () => {
    // Only shuffle pieces still in tray
    const piecesInTray = Array.from(tray.children);
    piecesInTray.sort(() => Math.random() - 0.5);
    piecesInTray.forEach(p => {
        tray.appendChild(p);
    });
});

btnRestart.addEventListener('click', () => {
    if(confirm(translations[currentLang].confirm_quit)) {
        showScreen('config');
    }
});

// Win Modal Controls
document.getElementById('btn-win-replay').addEventListener('click', () => {
    // Replay same puzzle
    winModal.classList.add('opacity-0');
    setTimeout(() => winModal.classList.add('hidden'), 500);
    initGame();
});

document.getElementById('btn-win-diff').addEventListener('click', () => {
    winModal.classList.add('opacity-0');
    setTimeout(() => winModal.classList.add('hidden'), 500);
    showScreen('config');
});

document.getElementById('btn-win-new').addEventListener('click', () => {
    winModal.classList.add('opacity-0');
    setTimeout(() => winModal.classList.add('hidden'), 500);
    showScreen('upload');
});

// --- History Logic ---
function saveToHistory(diff, secs, thumb) {
    let history = JSON.parse(localStorage.getItem('puzzleHistory') || '[]');
    const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
    history.unshift({ difficulty: diff, time: secs, date: date, thumb: thumb });
    
    // Prevenir desbordamiento del localStorage limitando a 20 entradas
    if(history.length > 20) history = history.slice(0, 20);
    
    localStorage.setItem('puzzleHistory', JSON.stringify(history));
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('puzzleHistory') || '[]');
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = `<p class="text-slate-500 text-center py-8">${translations[currentLang].history_empty}</p>`;
        return;
    }
    
    history.forEach(record => {
        const m = Math.floor(record.time / 60).toString().padStart(2, '0');
        const s = (record.time % 60).toString().padStart(2, '0');
        
        const t = translations[currentLang];
        let label = t.diff_easy;
        let color = "text-green-400";
        if(record.difficulty === 24) { label = t.diff_medium; color = "text-yellow-400"; }
        if(record.difficulty >= 48) { label = t.diff_hard; color = "text-red-400"; }
        
        const thumbHtml = record.thumb ? `<img src="${record.thumb}" class="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md border border-slate-500 shadow-sm flex-shrink-0" />` : `<div class="w-12 h-12 md:w-16 md:h-16 bg-slate-800 border border-slate-600 rounded-md flex-shrink-0 flex items-center justify-center"><i data-lucide="image" class="w-6 h-6 text-slate-500"></i></div>`;

        historyList.innerHTML += `
            <div class="bg-slate-700/50 rounded-xl p-3 border border-slate-600 flex gap-4 items-center transition hover:bg-slate-700">
                ${thumbHtml}
                <div class="flex-1">
                    <p class="font-bold text-white flex items-center gap-2">${label} <span class="text-xs bg-slate-900/50 text-slate-300 px-2 py-0.5 rounded-full border border-slate-600">${record.difficulty} ${translations[currentLang].pieces}</span></p>
                    <p class="text-xs text-slate-400 mt-1"><i data-lucide="calendar" class="w-3 h-3 inline"></i> ${record.date}</p>
                </div>
                <div class="font-mono ${color} font-black text-lg pr-2 md:text-xl">
                    ${m}:${s}
                </div>
            </div>
        `;
    });
    
    // Inyectar iconos generados si existen placeholders
    lucide.createIcons({
        root: historyList
    });
}

btnShowHistory.addEventListener('click', () => {
    loadHistory();
    historyModal.classList.remove('hidden');
    setTimeout(() => {
        historyModal.classList.remove('opacity-0');
        historyModalContent.classList.remove('scale-95');
        historyModalContent.classList.add('scale-100');
    }, 10);
});

btnCloseHistory.addEventListener('click', () => {
    historyModal.classList.add('opacity-0');
    historyModalContent.classList.remove('scale-100');
    historyModalContent.classList.add('scale-95');
    setTimeout(() => historyModal.classList.add('hidden'), 500);
});

// Inicializar idioma
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        setLanguage(e.target.dataset.lang);
    });
});
setLanguage(currentLang);
