// term zaten terminal-config.js'de oluşturuldu, tekrar oluşturmaya gerek yok

// Terminal container'a bağla
term.open(document.getElementById('terminal-container'));

// Terminal boyutunu ayarla
function updateTerminalSize() {
    const dims = {
        cols: Math.floor((window.innerWidth - 120) / 9),
        rows: Math.floor((window.innerHeight - 120) / 20)
    };
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

// Hoş geldin mesajı
writeLine('\x1b[1m\x1b[38;5;205m' + 
    '    ____             __                __   ____            __  /__    _ __\n' +
    '   / __ )____ ______/ /_____  ____  __/ /  / __ \\___  ____/ /_/ __\\  (_) /_\n' +
    '  / __  / __/ / ___/ //_/ _ \\/ __ \\/ / /  / /_/ / _ \\/ __  / / / /  / / __/\n' +
    ' / /_/ / /_/ / /__/ ,< /  __/ / / / / /  / ____/  __/ /_/ / / / /  / / /_\n' +
    '/_____/\\__,_/\\___/_/|_|\\___/_/ /_/_/_/  /_/    \\___/\\__,_/_//_/  /_/\\__/\x1b[0m'
);
writeLine('');
writeLine('\x1b[1m\x1b[38;5;81mBackend Developer Terminal v2.0.0 - Type "help" for available commands\x1b[0m');
writeLine('');
term.write(terminalState.prompt);

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
        term.write('\r\n');
        const command = terminalState.currentLine.trim();
        
        if (command) {
            addToHistory(command);
            const [cmd, ...args] = command.toLowerCase().split(' ');
            
            if (commands.hasOwnProperty(cmd)) {
                try {
                    Promise.resolve(commands[cmd](args)).finally(() => {
                        terminalState.currentLine = '';
                        terminalState.cursorPosition = 0;
                        term.write('\r\n' + terminalState.prompt);
                    });
                } catch (error) {
                    writeLine('Error executing command: ' + error);
                    term.write(terminalState.prompt);
                }
            } else {
                writeLine(`Command not found: ${cmd}`);
                writeLine('Type "help" for available commands');
                term.write(terminalState.prompt);
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
    }
});
