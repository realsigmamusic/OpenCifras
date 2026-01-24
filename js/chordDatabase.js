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
		}
	},
	"C#": {
		"dominant seventh": {
			chord: [
				//[1, 1],
				[2, 3],
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
	},
	"D": {
		"major": {
			chord: [
				[1, 2],
				[2, 3],
				[3, 2],
				//[4, 0],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				//[1, 1],
				//[2, 3],
				[3, 2],
				//[4, 0],
				[5, 'x'],
				[6, 'x']
			],
			barres: [
				{ fromString: 2, toString: 1, fret: 1 }
			],
			position: 0
		}
	},
	"E": {
		"major": {
			chord: [
				//[1, 0],
				//[2, 0],
				[3, 1],
				[4, 2],
				[5, 2],
				//[6, 0]
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				//[1, 0],
				//[2, 0],
				[3, 1],
				//[4, 0],
				[5, 2],
				//[6, 0]
			],
			position: 0
		},
		"major over D": {
			chord: [
				//[1, 1],
				[2, 2],
				//[3, 1],
				//[4, 'x'],
				[5, 2],
				//[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 1, fret: 1 }
			],
			position: 4
		}
	},
	"F#": {
		"minor seventh": {
			chord: [
				//[1, 2],
				//[2, 2],
				//[3, 2],
				//[4, 2],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		}
	},
	"G": {
		"major": {
			chord: [
				[1, 3],
				[2, 3],
				//[3, 0],
				//[4, 0],
				[5, 2],
				[6, 3]
			],
			position: 0
		}
	},
	"A": {
		"major": {
			chord: [
				//[1, 0],
				[2, 2],
				[3, 2],
				[4, 2],
				//[5, 0],
				[6, 'x']
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				//[1, 0],
				[2, 2],
				//[3, 0],
				[4, 2],
				//[5, 0],
				[6, 'x']
			],
			position: 0
		}
	},
	"B": {
		"dominant seventh": {
			chord: [
				[1, 2],
				//[2, 0],
				[3, 2],
				[4, 1],
				[5, 2],
				[6, 'x']
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				//[1, 2],
				[2, 3],
				//[3, 2],
				[4, 4],
				//[5, 2],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 2 }
			],
			position: 0
		}
	}
}