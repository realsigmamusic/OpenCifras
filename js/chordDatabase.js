// https://github.com/0xfe/vexchords
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
		"augmented": {
			chord: [
				[1, 'x'],
				//[2, 1],
				//[3, 1],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 2, fret: 1 }
			],
			position: 0
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
		"dominant seventh": {
			chord: [
				[1, 2],
				[2, 1],
				[3, 2],
				//[4, 0],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"augmented": {
			chord: [
				[1, 2],
				[2, 3],
				[3, 3],
				//[4, 0],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				[1, 3],
				[2, 3],
				[3, 2],
				//[4, 0],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"minor": {
			chord: [
				[1, 1],
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
				//[2, 1],
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
		"suspended fourth": {
			chord: [
				//[1, 0],
				//[2, 0],
				[3, 2],
				[4, 2],
				[5, 2],
				//[6, 0]
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 0],
				//[2, 0],
				//[3, 0],
				[4, 2],
				[5, 2],
				//[6, 0]
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				//[1, 0],
				[2, 3],
				//[3, 0],
				[4, 2],
				[5, 2],
				//[6, 0]
			],
			position: 0
		}
	},
	"F": {
		"major": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 2],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 2],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 3],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 0
		}
	},
	"G": {
		"major": {
			chord: [
				[1, 3],
				[2, 3],
				[3, 'x'],
				[4, 'x'],
				[5, 2],
				[6, 3]
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				[1, 1],
				//[2, 0],
				//[3, 0],
				//[4, 0],
				[5, 2],
				[6, 3]
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				[1, 3],
				[2, 1],
				//[3, 0],
				//[4, 0],
				[5, 'x'],
				[6, 3]
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 3
		},
		"minor seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
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
		},
		"augmented": {
			chord: [
				//[1, 0],
				[2, 2],
				[3, 2],
				[4, 3],
				//[5, 0],
				[6, 'x']
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				//[1, 0],
				[2, 3],
				[3, 2],
				[4, 2],
				//[5, 0],
				[6, 'x']
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 0],
				[2, 1],
				[3, 2],
				[4, 2],
				//[5, 0],
				//[6, 0]
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				//[1, 0],
				[2, 1],
				//[3, 0],
				[4, 2],
				//[5, 0],
				[6, 'x']
			],
			position: 0
		}
	},
	"B": {
		"major": {
			chord: [
				//[1, 2],
				[2, 4],
				[3, 4],
				[4, 4],
				//[5, 2],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 0
		},
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
		"suspended fourth": {
			chord: [
				//[1, 2],
				[2, 5],
				[3, 4],
				[4, 4],
				//[5, 2],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 2 }
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 2],
				[2, 3],
				[3, 4],
				[4, 4],
				//[5, 2],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 2 }
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
	},
	"C#": {
		"major": {
			chord: [
				//[1, 1],
				[2, 2],
				//[3, 1],
				[4, 3],
				[5, 4],
				[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 1, fret: 1 }
			],
			position: 0
		},
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
			position: 4
		},
		"suspended fourth": {
			chord: [
				//[1, 1],
				[2, 4],
				[3, 3],
				[4, 3],
				//[5, 1],s
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 4
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
			position: 4
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
			position: 4
		}
	},
	"D#": {
		"major": {
			chord: [
				[1, 3],
				[2, 4],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				[1, 3],
				[2, 2],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"augmented": {
			chord: [
				[1, 'x'],
				//[2, 1],
				//[3, 1],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 2, fret: 1 }
			],
			position: 4
		},
		"suspended fourth": {
			chord: [
				[1, 4],
				[2, 4],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"minor": {
			chord: [
				[1, 2],
				[2, 4],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				[1, 2],
				[2, 2],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		}
	},
	"F#": {
		"major": {
			chord: [
				//[1, 2],
				//[2, 2],
				[3, 3],
				[4, 4],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				//[1, 2],
				//[2, 2],
				[3, 3],
				//[4, 2],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				//[1, 2],
				//[2, 2],
				[3, 4],
				[4, 4],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 2],
				//[2, 2],
				//[3, 2],
				[4, 4],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
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
	"G#": {
		"major": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 2],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 3
		},
		"dominant seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 2],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		},
		"suspended fourth": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 3],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		},
		"minor": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		},
		"minor seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		}
	},
	"A#": {
		"major": {
			chord: [
				//[1, 1],
				[2, 3],
				[3, 3],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 0
		},
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
			position: 0
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
			position: 1
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
			position: 0
		}
	},
	"Db": {
		"major": {
			chord: [
				//[1, 1],
				[2, 2],
				//[3, 1],
				[4, 3],
				[5, 4],
				[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 1, fret: 1 }
			],
			position: 0
		},
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
			position: 4
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
			position: 4
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
			position: 4
		}
	},
	"Eb": {
		"major": {
			chord: [
				[1, 3],
				[2, 4],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				[1, 3],
				[2, 2],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"augmented": {
			chord: [
				[1, 'x'],
				//[2, 1],
				//[3, 1],
				[4, 2],
				[5, 3],
				[6, 'x']
			],
			barres: [
				{ fromString: 3, toString: 2, fret: 1 }
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				[1, 4],
				[2, 4],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"minor": {
			chord: [
				[1, 2],
				[2, 4],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		},
		"minor seventh": {
			chord: [
				[1, 2],
				[2, 2],
				[3, 3],
				[4, 1],
				[5, 'x'],
				[6, 'x']
			],
			position: 0
		}
	},
	"Gb": {
		"major": {
			chord: [
				//[1, 2],
				//[2, 2],
				[3, 3],
				[4, 4],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
		"dominant seventh": {
			chord: [
				//[1, 2],
				//[2, 2],
				[3, 3],
				//[4, 2],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
		"suspended fourth": {
			chord: [
				//[1, 2],
				//[2, 2],
				[3, 4],
				[4, 4],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
		"minor": {
			chord: [
				//[1, 2],
				//[2, 2],
				//[3, 2],
				[4, 4],
				[5, 4],
				//[6, 2]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 2 }
			],
			position: 0
		},
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
	"Ab": {
		"major": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 2],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 3
		},
		"dominant seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 2],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		},
		"suspended fourth": {
			chord: [
				//[1, 1],
				//[2, 1],
				[3, 3],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		},
		"minor": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				[4, 3],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		},
		"minor seventh": {
			chord: [
				//[1, 1],
				//[2, 1],
				//[3, 1],
				//[4, 1],
				[5, 3],
				//[6, 1]
			],
			barres: [
				{ fromString: 6, toString: 1, fret: 1 }
			],
			position: 4
		}
	},
	"Bb": {
		"major": {
			chord: [
				//[1, 1],
				[2, 3],
				[3, 3],
				[4, 3],
				//[5, 1],
				[6, 'x']
			],
			barres: [
				{ fromString: 5, toString: 1, fret: 1 }
			],
			position: 0
		},
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
			position: 0
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
			position: 1
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
			position: 0
		}
	}
}