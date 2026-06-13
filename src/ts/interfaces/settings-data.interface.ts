
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
        iconPath: '../../public/assets/img/palette.svg',
        radioName: 'game-theme',
        items: ['Code vibes theme', 'Gaming theme'],
    },
    {
        type: 'player',
        title: 'Choose player',
        iconPath: '../../public/assets/img/player.svg',
        radioName: 'player',
        items: ['Blue', 'Orange']
    },
    {
        type: 'size',
        title: 'Board size',
        iconPath: '../../public/assets/img/board_size.svg',
        radioName: 'board-size',
        items: ['16 cards', '24 cards', '36 cards']
    }
]

