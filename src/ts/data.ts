export const preSelectedTheme = "codeVibes";
export const settingsData = [
  {
    type: "theme",
    title: "Game Themes",
    iconPath: "palette.svg",
    radioName: "game-theme",
    items: [
      {
        id: "codeVibes",
        label: "Code vibes theme",
      },

      {
        id: "gaming",
        label: "Gaming theme",
      },

      {
        id: "daProjects",
        label: "DA Projects theme",
      },

      {
        id: "food",
        label: "Food theme",
      },
    ],
  },

  {
    type: "player",
    title: "Choose player",
    iconPath: "player.svg",
    radioName: "player",
    items: [
      {
        id: "blue",
        label: "Blue",
      },
      {
        id: "orange",
        label: "Orange",
      },
    ],
  },

  {
    type: "size",
    title: "Board size",
    iconPath: "board_size.svg",
    radioName: "board-size",
    items: [
      {
        id: "16",
        label: "16 cards",
      },
      {
        id: "24",
        label: "24 cards",
      },
      {
        id: "36",
        label: "36 cards",
      },
    ],
  },
];

export const themes = {
  codeVibes: {
    id: "code",
    label: "Code vibes theme",
    bodyClass: "theme-code",
    headerClass: "header-code",
    gameBackground: "game-bg-code",
    gameOverBackground: "game-over-bg-code",
    winnerBackground: "winner-bg-code",
    cardBackground: "card-bg-code",
    cardMatchBorder: "card-match-border-code",
    cardMatchBackground: "card-match-bg-code",
    cardMatchShadow: "card-match-shadow-code",
    playerIcons: {
      blue: "code_blue.svg",
      orange: "code_orange.svg",
    },
    previewPath: "preview-code.svg",

    motifs: [
      "angular.svg",
      "bootstrap.svg",
      "css.svg",
      "database.svg",
      "django.svg",
      "firebase.svg",
      "git.svg",
      "github.svg",
      "html.svg",
      "javascript.svg",
      "node-js.svg",
      "python.svg",
      "react.svg",
      "sass.svg",
      "terminal.svg",
      "typescript.svg",
      "vscode.svg",
      "vue-js.svg",
    ],

    winnerIcons: {
      winBlue: "win_blue.svg",
      winOrange: "win_orange.svg",
      draw: "scales.svg",
      decoration: "confetti.svg",
    },
  },

  gaming: {
    id: "gaming",
    label: "Gaming theme",
    bodyClass: "theme-gaming",
    headerClass: "header-gaming",
    gameBackground: "game-bg-gaming",
    gameOverBackground: "game-over-bg-gaming",
    winnerBackground: "winner-bg-gaming",
    cardBackground: "card-bg-gaming",
    cardMatchBorder: "card-match-border-gaming",
    cardMatchBackground: "card-match-bg-gaming",
    cardMatchShadow: "card-match-shadow-gaming",
    playerIcons: {
      blue: "player_blue.svg",
      orange: "player_orange.svg",
    },
    previewPath: "preview-gaming.svg",
    motifs: [
      "banana.svg",
      "card.svg",
      "coin.svg",
      "controller.svg",
      "dice.svg",
      "gameboy.svg",
      "labyrinth.svg",
      "medal.svg",
      "meeple_circle.svg",
      "meeple_square.svg",
      "meeple_triangle.svg",
      "mushroom.svg",
      "pacman_game.svg",
      "pacman.svg",
      "pixel.svg",
      "play.svg",
      "puzzle.svg",
      "snake.svg",
    ],
    winnerIcons: {
      winBlue: "goblet.svg",
      winOrange: "goblet.svg",
      draw: "scales.svg",
      decoration: "",
    },
  },

  daProjects: {
    id: "daProjects",
    label: "DA Projects theme",
    bodyClass: "theme-projects",
    headerClass: "header-projects",
    gameBackground: "game-bg-projects",
    gameOverBackground: "game-over-bg-projects",
    winnerBackground: "winner-bg-projects",
    cardBackground: "card-bg-projects",
    cardMatchBorder: "card-match-border-projects",
    cardMatchBackground: "card-match-bg-projects",
    cardMatchShadow: "",

    playerIcons: {
      blue: "player_blue.svg",
      orange: "player_orange.svg",
    },
    previewPath: "preview-projects.svg",

    motifs: [
      "noodles.svg",
      "soup.svg",
      "eggs.svg",
      "flower.svg",
      "join.svg",
      "chefs_hat.svg",
      "coderr.svg",
      "basket.svg",
      "pokeball.svg",
      "connect4.svg",
      "smile.svg",
      "blue.svg",
      "daBubble.svg",
      "polloLoco.svg",
      "cuisine.svg",
      "person.svg",
      "shark.svg",
      "coins.svg",
    ],

    winnerIcons: {
      winBlue: "win_blue.svg",
      winOrange: "win_orange.svg",
      draw: "scales.svg",
      decoration: "confetti.svg",
    },
  },

  food: {
    id: "food",
    label: "Food theme",
    bodyClass: "theme-food",
    headerClass: "header-food",
    gameBackground: "game-bg-food",
    gameOverBackground: "game-over-bg-food",
    winnerBackground: "winner-bg-food",
    cardBackground: "card-bg-food",
    cardMatchBorder: "card-match-border-food",
    cardMatchBackground: "card-match-bg-food",
    cardMatchShadow: "",

    playerIcons: {
      blue: "player_blue.svg",
      orange: "player_orange.svg",
    },
    previewPath: "preview-food.svg",

    motifs: [
      "pommes.svg",
      "pizza.svg",
      "sandwich.svg",
      "donut.svg",
      "sushi.svg",
      "corndog.svg",
      "cheeseburger.svg",
      "pretzel.svg",
      "cupcake.svg",
      "pudding.svg",
      "pannacotta.svg",
      "chocolate.svg",
      "chickenwings.svg",
      "wrap.svg",
      "pita.svg",
      "icecream.svg",
      "salad.svg",
      "macarons.svg",
    ],

    winnerIcons: {
      winBlue: "win_blue.svg",
      winOrange: "win_orange.svg",
      draw: "scales.svg",
      decoration: "",
    },
  },
};