const terminalConfig = {
    cursorBlink: true,
    cursorStyle: 'block',
    fontSize: 14,
    fontFamily: 'Consolas, monospace',
    letterSpacing: 0,
    lineHeight: 1,
    theme: {
        background: '#000',
        foreground: '#fff',
    },
    rendererType: 'canvas',
    convertEol: true,
    wordWrap: true,
    scrollback: 1000,
    // Link desteği için yeni ayarlar ekle
    allowProposedApi: true,
    linkHandler: {
        activate: (e, uri) => {
            window.open(uri, '_blank');
            return false;
        }
    },
    windowOptions: {
        windowsMode: true
    }
};

// Global term değişkenini oluştur
term = new Terminal(terminalConfig);

// Link eklentisini yükle
const webLinksAddon = new WebLinksAddon();
term.loadAddon(webLinksAddon);

const terminalState = {
    commandHistory: [],
    historyIndex: -1,
    currentLine: '',
    cursorPosition: 0,
    prompt: '\x1b[1m\x1b[38;5;87m➜\x1b[0m \x1b[1m\x1b[38;5;76m~/portfolio\x1b[0m \x1b[38;5;39m$\x1b[0m '
};

// writeLine ve simulateLoading fonksiyonlarını kaldır çünkü index.html'de tanımlandı
