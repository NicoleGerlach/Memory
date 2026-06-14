
export interface SettingsData {
    type: string;
    title: string;
    iconPath: string;
    radioName: string;
    items: string[];
}

export const SettingsDatas: SettingsData[] = [
    {
        type: 'theme',
        title: 'Game Themes',
        iconPath: '../../public/assets/img/ui/palette.svg',
        radioName: 'game-theme',
        items: ['Code vibes theme', 'Gaming theme'],
    },
    {
        type: 'player',
        title: 'Choose player',
        iconPath: '../../public/assets/img/ui/player.svg',
        radioName: 'player',
        items: ['Blue', 'Orange']
    },
    {
        type: 'size',
        title: 'Board size',
        iconPath: '../../public/assets/img/ui/board_size.svg',
        radioName: 'board-size',
        items: ['16 cards', '24 cards', '36 cards']
    }
]

export const themes = [
    {
        id: "code",
        label: "Code vibes theme",
        bodyClass: "theme-code-vibes",
        gameBackground: "game-bg-code",
        gameOverBackground: "game-over-bg-code",
        winnerBackground: "winner-bg-code",
        cardBackground: "card-bg-code",
        playerIcon: "player.svg",
        preview: "codepreview.svg",

        motifs: [
            'angular.svg',
            'bootstrap.svg',
            'css.svg',
            'django.svg',
            'firebase.svg',
            'git.svg',
            'github.svg',
            'html.svg',
            'javascript.svg',
            'nodejs.svg',
            'python.svg',
            'react.svg',
            'sass.svg',
            'sql.svg',
            'terminal.svg',
            'typescript.svg',
            'vscode.svg',
            'vue.svg',
        ],

        winnerIcons: {
            win: "player.svg",
            draw: "scales.svg",
            decoration: "confetti.svg",
        },
    },
    {
        id: "gaming",
        label: "Gaming theme",
        bodyClass: "theme-gaming",
        gameBackground: "game-bg-code",
        gameOverBackground: "game-over-bg-gaming",
        winnerBackground: "winner-bg-gaming",
        cardBackground: "card-bg-gaming",
        playerIcon: "player.svg",
        preview: "gamepreview.svg",

        motifs: [
            'banana.svg',
            'card.svg',
            'coin.svg',
            'controller.svg',
            'dice.svg',
            'gameboy.svg',
            'labyrinth.svg',
            'medal.svg',
            'mepple_circle.svg',
            'meeple_square.svg',
            'meeple_triangle.svg',
            'mushroom.svg',
            'pacman_game.svg',
            'pacman.svg',
            'pixel.svg',
            'play.svg',
            'puzzle.svg',
            'snake.svg',
        ],

        winnerIcons: {
            win: "goblet.svg",
            draw: "scales.svg",
            decoration: "",
        },
    },
]