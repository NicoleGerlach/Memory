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
    bodyClass: "theme-code-vibes",
    headerClass: "header-code-vibes",
    gameBackground: "game-bg-code",
    gameOverBackground: "game-over-bg-code",
    winnerBackground: "winner-bg-code",
    cardBackground: "card-bg-code",
    cardMatchBorder: "border-card-code",
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
      win: "player.svg",
      draw: "scales.png",
      decoration: "",
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
      "pixel.svg",
      "play.svg",
      "puzzle.svg",
      "snake.svg",
    ],
    winnerIcons: {
      win: "goblet.svg",
      draw: "scales.png",
      decoration: "",
    },
  },

  daProjects: {
    id: "projects",
    label: "DA Projects theme",
    bodyClass: "theme-da-projects",
    headerClass: "header-da-projects",
    gameBackground: "game-bg-projects",
    gameOverBackground: "game-over-bg-projects",
    winnerBackground: "winner-bg-projects",
    cardBackground: "card-bg-projects",
    playerIcons: {
      blue: "player_blue.svg",
      orange: "player_orange.svg",
    },
    previewPath: "preview-projects.svg",

    motifs: [
      "code-a-cuisine.svg",
      "coderr.svg",
      "coins.svg",
      "cooking.png",
      "da-bubble.svg",
      "el-pollo-loco.svg",
      "flower.svg",
      "join.svg",
      "kanmind.svg",
      "lieferando.svg",
      "noodles.svg",
      "pokedex.svg",
      "ramen.svg",
      "sharkie.png",
      "tic-tac-toe.svg",
      "topping.svg",
      "user.svg",
      "videoflix.svg",
    ],

    winnerIcons: {
      win: "player.svg",
      draw: "scales.png",
      decoration: "confetti.svg",
    },
  },

  food: {
    id: "food",
    label: "Food theme",
    bodyClass: "theme-food",
    headerClass: "header-da-projects",
    gameBackground: "game-bg-food",
    gameOverBackground: "game-over-bg-food",
    winnerBackground: "winner-bg-food",
    cardBackground: "card-bg-food",
    playerIcons: {
      blue: "player_blue.svg",
      orange: "player_orange.svg",
    },
    previewPath: "preview-food.svg",

    motifs: [
      "chicken-nuggets.svg",
      "chocolate-cake.svg",
      "chocolate.svg",
      "cupcake.png",
      "donut.svg",
      "fries.svg",
      "hamburger.svg",
      "ice-cream.svg",
      "kebap.svg",
      "macaron.svg",
      "pizza.svg",
      "pretzel.svg",
      "pudding.svg",
      "salad.png",
      "sandwich.svg",
      "skewer.svg",
      "sushi.svg",
      "wrap.svg",
    ],

    winnerIcons: {
      win: "player.svg",
      draw: "scales.png",
      decoration: "",
    },
  },
};