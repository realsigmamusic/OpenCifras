// [corda, casa, dedo]
export const chordDatabase = {
	"C": {
		"major": {
			chord: [
				//[1, 0],
				[2, 1],
				//[3, 0],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			position: 0
		},
		"major over E": {
			chord: [
				//[1, 0],
				[2, 1],
				//[3, 0],
				[4, 2],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"major over G": {
			chord: [
				//[1, 0],
				[2, 1],
				//[3, 0],
				[4, 2],
				[5, 3],
				[6, 3]
			],
			position: 0
		},
		"major over Bb": {
			chord: [
				//[1, 0],
				[2, 1],
				//[3, 0],
				[4, 'x'],
				[5, 1],
				[6, 'x']
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				//[1, 0],
				[2, 1],
				[3, 3],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			position: 0
		},
		"dominant seventh over E": {
			chord: [
				//[1, 0],
				[2, 1],
				[3, 3],
				[4, 2],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"dominant seventh over G": {
			chord: [
				[1, 'x'],
				[2, 1],
				[3, 3],
				[4, 2],
				[5, 'x'],
				[6, 3]
			],
			position: 0
		},
		"dominant ninth": {
			chord: [
				[1, 'x'],
				[2, 3],
				[3, 3],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			position: 0
		},
		"major seventh": {
			chord: [
				//[1, 0],
				//[2, 0],
				//[3, 0],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 1],
				[2, 2],
				[3, 3],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		},
		"minor over Eb": {
			chord: [
				[1, 'x'],
				[2, 1],
				[3, 2],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			position: 3
		},
		"minor over G": {
			chord: [
				//[1, 1],
				[2, 2],
				[3, 3],
				[4, 3],
				//[5, 1],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 3
		},
		"minor over Bb": {
			chord: [
				[1, 'x'],
				[2, 1],
				[3, 2],
				[4, 2],
				[5, 'x'],
				[6, 3]
			],
			position: 3
		},
		"minor seventh over Bb": {
			chord: [
				//[1, 1],
				[2, 2],
				//[3, 1],
				[4, 3],
				[5, 'x'],
				[6, 4]
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		},
		"minor seventh": {
			chord: [
				//[1, 1],
				[2, 2],
				//[3, 1],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		},
		"minor/major seventh": {
			chord: [
				[1, 1],
				[2, 2],
				[3, 2],
				[4, 3],
				[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		},
		"minor sixth": {
			chord: [
				[1, 3],
				[2, 4],
				[3, 2],
				[4, 'x'],
				[5, 3],
				[6, 'x']
			],
			position: 0
		},
		"minor ninth": {
			chord: [
				[1, 'x'],
				[2, 3],
				[3, 3],
				[4, 1],
				[5, 3],
				[6, 'x']
			],
			position: 0
		},
		"half-diminished": {
			chord: [
				[1, 'x'],
				[2, 2],
				[3, 1],
				[4, 2],
				[5, 1],
				[6, 'x']
			],
			position: 3
		},
		"diminished": {
			chord: [
				[1, 'x'],
				[2, 2],
				[3, 3],
				[4, 2],
				[5, 1],
				[6, 'x']
			],
			position: 3
		},
		"diminished seventh": {
			chord: [
				[1, 'x'],
				[2, 3],
				[3, 1],
				[4, 3],
				[5, 2],
				[6, 'x']
			],
			position: 3
		},
		"augmented": {
			chord: [
				[1, 'x'],
				[2, 1],
				[3, 1],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 2, fret: 1 }
			],
			position: 3
		},
		"augmented seventh": {
			chord: [
				[1, 'x'],
				[2, 3],
				//[3, 1],
				[4, 4],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 2, fret: 1 }
			],
			position: 3
		},
		"suspended second": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 3],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		},
		"suspended fourth": {
			chord: [
				//[1, 1],
				[2, 4],
				[3, 3],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		},
		"suspended fourth seventh": {
			chord: [
				//[1, 1],
				[2, 4],
				//[3, 1],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 3
		}
	}
}