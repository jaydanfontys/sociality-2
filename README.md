# Sociality — Het Skatepark (Hover V4)

This is the **original browser Hover V4 source**, extracted into editable HTML, CSS, JavaScript and WebP assets. It corresponds to `Sociality-Play-In-Browser-Hover-V4.html`.

## Open and play

1. Unzip the folder without moving any files out of it.
2. Open `index.html` in Chrome, Edge or Firefox to run the game.
3. For editing, open the entire `Sociality-Hover-V4-Source-Code` folder in Visual Studio Code.
4. Refresh the browser after editing to see the changes. You can also use the VS Code Live Server extension if desired.

## Folder structure

```
Sociality-Hover-V4-Source-Code/
├── index.html         # Game layout and buttons
├── styles/
│   └── game.css       # Theme, layout, pawn, hover animations
├── js/
│   └── game.js        # Game data, decision tree, Jokers, collection logic
└── assets/
    ├── board.webp    # Original illustrated board
    ├── cards/        # Original story-card fronts and backs
    └── concepts/     # The eight collectible card faces
```

## Where to find the main features

- **Decision choices, routes and concepts**: `js/game.js`, in the `GAME` data structure.
- **Game progress, earned cards, and Jokers**: `js/game.js`, in the `render()` and related functions.
- **Floating collected concept cards**: `styles/game.css` (`.sg-award-card` and `.sg-conceptmark`) combined with the JavaScript that inserts earned-card images.
- **Board, story card and controls**: `index.html`.
- **Visual assets**: `assets/board.webp`, `assets/cards/`, `assets/concepts/`.

## Notes

This source is split from the **self-contained original HTML**: the game data and code are preserved, while the inline styles and base64 image assets have been separated into their own files. The only gameplay code change is the path used to load local images from `assets/`.

The original single-file version is also available as `Sociality-Play-In-Browser-Hover-V4.html` if you want to open or demonstrate it without folders.

The original Sociality artwork belongs to its respective owners; ask for permission before redistributing it outside authorized InnerGames use.
