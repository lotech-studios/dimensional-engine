import * as DB from '../database'

export function bob ( eT, mult, offset ) {

	return Math.sin( eT ) * mult + offset

}

export function generateUUID () {

    const LUT = DB.Characters.LUT.HEX

	const d0 = Math.random() * 0xffffffff | 0
	const d1 = Math.random() * 0xffffffff | 0
	const d2 = Math.random() * 0xffffffff | 0
	const d3 = Math.random() * 0xffffffff | 0
	const uuid = LUT[ d0 & 0xff ] + LUT[ d0 >> 8 & 0xff ] + LUT[ d0 >> 16 & 0xff ] + LUT[ d0 >> 24 & 0xff ] + '-' +
			LUT[ d1 & 0xff ] + LUT[ d1 >> 8 & 0xff ] + '-' + LUT[ d1 >> 16 & 0x0f | 0x40 ] + LUT[ d1 >> 24 & 0xff ] + '-' +
			LUT[ d2 & 0x3f | 0x80 ] + LUT[ d2 >> 8 & 0xff ] + '-' + LUT[ d2 >> 16 & 0xff ] + LUT[ d2 >> 24 & 0xff ] +
			LUT[ d3 & 0xff ] + LUT[ d3 >> 8 & 0xff ] + LUT[ d3 >> 16 & 0xff ] + LUT[ d3 >> 24 & 0xff ]

	// .toLowerCase() here flattens concatenated strings to save heap memory space.
	return uuid.toLowerCase()

}