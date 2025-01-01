// term zaten terminal-config.js'de oluşturuldu, tekrar oluşturmaya gerek yok

// Terminal başlangıç durumu
const terminalState = {
    commandHistory: [],
    historyIndex: -1,
    currentLine: '',
    cursorPosition: 0,
    prompt: '\x1b[1m\x1b[38;5;87m➜\x1b[0m \x1b[1m\x1b[38;5;76m~/portfolio\x1b[0m \x1b[38;5;39m$\x1b[0m '
};

// Terminal container'a bağla
term.open(document.getElementById('terminal-container'));

// Terminal boyutunu ayarla fonksiyonunu güncelle
function updateTerminalSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Mobil cihazlar için font boyutunu ayarla
    let fontSize = 14;
    if (width <= 480) {
        fontSize = 12;
    } else if (width <= 768) {
        fontSize = 13;
    }

    // Margin ve padding'leri hesaba kat
    const margin = width <= 480 ? 10 : (width <= 768 ? 20 : 30);
    const dims = {
        cols: Math.floor((width - (margin * 2)) / (fontSize * 0.6)),
        rows: Math.floor((height - (margin * 2)) / (fontSize * 1.2))
    };

    term.options.fontSize = fontSize;
    term.resize(dims.cols, dims.rows);
}

// Pencere boyutu değiştiğinde terminal boyutunu güncelle
window.addEventListener('resize', updateTerminalSize);
updateTerminalSize();

// Terminal giriş/çıkış yönetimi
function clearCurrentLine() {
    const currentLineLength = terminalState.prompt.length + terminalState.currentLine.length;
    term.write('\r' + ' '.repeat(currentLineLength) + '\r');
}

function refreshLine() {
    clearCurrentLine();
    term.write(terminalState.prompt + terminalState.currentLine);
    // Cursor pozisyonunu doğru konuma getir
    if (terminalState.currentLine.length > terminalState.cursorPosition) {
        const moveBack = terminalState.currentLine.length - terminalState.cursorPosition;
        term.write('\x1b[' + moveBack + 'D');
    }
}

function addToHistory(command) {
    if (command && command.trim() && terminalState.commandHistory[0] !== command) {
        terminalState.commandHistory.unshift(command);
        if (terminalState.commandHistory.length > 50) {
            terminalState.commandHistory.pop();
        }
    }
}

// ASCII art ve başlık için fonksiyon
function getWelcomeMessage() {
    const width = window.innerWidth;
    if (width <= 768) {
        // Mobil cihazlar için basit başlık
        return '\x1b[1m\x1b[38;5;205m' + 
            '╔═══════════════════╗\n' +
            '║    Backend OUZ    ║\n' +
            '╚═══════════════════╝\x1b[0m';
    }
    
    // Desktop için tam ASCII art
    return '\x1b[1m\x1b[38;5;205m' + 
        '  ____             _                  _    ___  _    _ ______\n' +
        ' |  _ \\           | |                | |  / _ \\| |  | |___  /\n' +
        ' | |_) | __ _  ___| | _____ _ __   __| | | | | | |  | |  / / \n' +
        ' |  _ < / _` |/ __| |/ / _ \\ \'_ \\ / _` | | | | | |  | | / /  \n' +
        ' | |_) | (_| | (__|   <  __/ | | | (_| | | |_| | |__| |/ /__ \n' +
        ' |____/ \\__,_|\\___|_|\\_\\___|_| |_|\\__,_|  \\___/ \\____//_____|\n' +
        '                                                             \n' +
        '                                                             \x1b[0m';
}

// Hoş geldin mesajı ve otomatik başlatma
writeLine(getWelcomeMessage());
writeLine('');
writeLine('\x1b[1m\x1b[38;5;81mBackend Developer Terminal v2.0.0 - Type "help" for available commands\x1b[0m');
writeLine('');
term.write(terminalState.prompt);

// Otomatik olarak infrastructure containerları başlat
setTimeout(() => {
    writeLine('docker compose up -d');
    commands.docker(['compose', 'up']); // Bu komut şimdi otomatik olarak springapp'i de başlatacak
}, 200);

// Klavye olaylarını dinle
term.onKey(({ key, domEvent }) => {
    const ev = domEvent;
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

    if (ev.keyCode === 9) { // Tab
        ev.preventDefault();
        const completedLine = handleTabCompletion(terminalState.currentLine);
        if (completedLine !== terminalState.currentLine) {
            terminalState.currentLine = completedLine;
            terminalState.cursorPosition = completedLine.length;
            refreshLine();
        }
    }
    else if (ev.keyCode === 13) { // Enter
        const command = terminalState.currentLine.trim();
        term.write('\r\n');
        
        if (command) {
            addToHistory(command);
            const [cmd, ...args] = command.toLowerCase().split(' ');
            
            if (commands.hasOwnProperty(cmd)) {
                try {
                    Promise.resolve(commands[cmd](args)).finally(() => {
                        term.write('\r\n' + terminalState.prompt);
                        updateMobileCommands(); // Komutları güncelle
                    });
                } catch (error) {
                    writeLine('Error executing command: ' + error);
                    term.write(terminalState.prompt);
                    updateMobileCommands();
                }
            } else {
                writeLine(`Command not found: ${cmd}`);
                writeLine('Type "help" for available commands');
                term.write(terminalState.prompt);
                updateMobileCommands();
            }
        } else {
            term.write(terminalState.prompt);
        }

        terminalState.currentLine = '';
        terminalState.cursorPosition = 0;
        terminalState.historyIndex = -1;
    }
    else if (ev.keyCode === 8) { // Backspace
        if (terminalState.cursorPosition > 0) {
            terminalState.currentLine = 
                terminalState.currentLine.slice(0, terminalState.cursorPosition - 1) + 
                terminalState.currentLine.slice(terminalState.cursorPosition);
            terminalState.cursorPosition--;
            refreshLine();
        }
    }
    else if (ev.keyCode === 37) { // Sol ok
        if (terminalState.cursorPosition > 0) {
            terminalState.cursorPosition--;
            term.write('\x1b[D');
        }
    }
    else if (ev.keyCode === 39) { // Sağ ok
        if (terminalState.cursorPosition < terminalState.currentLine.length) {
            terminalState.cursorPosition++;
            term.write('\x1b[C');
        }
    }
    else if (ev.keyCode === 38) { // Yukarı ok
        if (terminalState.historyIndex < terminalState.commandHistory.length - 1) {
            terminalState.historyIndex++;
            terminalState.currentLine = terminalState.commandHistory[terminalState.historyIndex];
            terminalState.cursorPosition = terminalState.currentLine.length;
            refreshLine();
        }
    }
    else if (ev.keyCode === 40) { // Aşağı ok
        if (terminalState.historyIndex > -1) {
            terminalState.historyIndex--;
            terminalState.currentLine = terminalState.historyIndex >= 0 
                ? terminalState.commandHistory[terminalState.historyIndex]
                : '';
            terminalState.cursorPosition = terminalState.currentLine.length;
            refreshLine();
        }
    }
    else if (printable && key.length === 1) {
        terminalState.currentLine = 
            terminalState.currentLine.slice(0, terminalState.cursorPosition) +
            key +
            terminalState.currentLine.slice(terminalState.cursorPosition);
        terminalState.cursorPosition++;
        refreshLine();
        updateMobileCommands(); // Her karakter girişinde komutları güncelle
    }
});

// Mobil klavye için ek olay dinleyicisi
document.addEventListener('input', function(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}, true);

// Terminal container'a tıklandığında mobil klavyeyi göster
document.getElementById('terminal-container').addEventListener('click', function() {
    term.focus();
});

// Terminal başlatıldığında mobil butonları güncelle ve klavye odağını ayarla
updateMobileCommands();
term.focus();
