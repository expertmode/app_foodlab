const { app, BrowserWindow, globalShortcut, Menu } = require('electron');
const path = require('node:path');

const SITE_URL = process.env.FOODLAB_URL || 'https://app-foodlab.vercel.app/?kiosk=1';

// Esconde menu nativo
Menu.setApplicationMenu(null);

let win;

function createWindow() {
    win = new BrowserWindow({
        fullscreen: true,
        kiosk: true,
        frame: false,
        autoHideMenuBar: true,
        backgroundColor: '#005E81',
        title: 'Foodlab',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            spellcheck: false,
            devTools: false,
        },
    });

    win.setMenuBarVisibility(false);
    win.removeMenu();
    win.loadURL(SITE_URL);

    // Bloqueia janelas pop-up (target=_blank etc.)
    win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    // Bloqueia menu de contexto
    win.webContents.on('context-menu', (e) => e.preventDefault());

    // Permite só navegação dentro do nosso domínio
    win.webContents.on('will-navigate', (e, url) => {
        if (!url.startsWith(new URL(SITE_URL).origin)) e.preventDefault();
    });
}

app.whenReady().then(() => {
    createWindow();

    // Atalhos: F5 e Ctrl+R fazem reload, F12 / Ctrl+Shift+I bloqueado
    globalShortcut.register('F5', () => win?.webContents.reload());
    globalShortcut.register('CommandOrControl+R', () => win?.webContents.reload());
    globalShortcut.register('CommandOrControl+Shift+R', () => {
        win?.webContents.session.clearCache();
        win?.webContents.reloadIgnoringCache();
    });
    // Permitir sair só com combinação rara: Ctrl+Alt+Shift+Q
    globalShortcut.register('CommandOrControl+Alt+Shift+Q', () => app.quit());
});

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
