package ww_utils

import (
	"dubdub.com/dubdub/ww/models"
)

// func BuildCoLDataSet(alLCounties *[]struct) {

// }

func ColAccessor(query string, county models.County) int {

	var v int

	switch query {

	case "col":
		v = int(county.Col)

	case "rav":
		v = int(county.Rav) // For some reason this metric is always asserted to be float64?

	case "r0":
		v = int(county.R0)

	case "r1":
		v = int(county.R1)

	case "r2":
		v = int(county.R2)

	case "r3":
		v = int(county.R3)

	case "r4":
		v = int(county.R4)

	case "mhc":
		v = int(county.Mhc)
	}

	return v
}

// func ColAccessorF64(query string, county models.County) float64 {

// 	var v float64

// 	switch query {

// 	return v
// }

func WFCAccessor(query string, wfc models.WFC) float64 {

	var v float64

	switch query {

	case "lq":
		v = float64(wfc.Lq)

	case "pk":
		v = float64(wfc.Pk)

	case "em":
		v = float64(wfc.Em)

	case "ex0":
		v = float64(wfc.Ex0)

	case "ex1":
		v = float64(wfc.Ex1)

	case "ex2":
		v = float64(wfc.Ex2)

	case "ex3":
		v = float64(wfc.Ex3)

	case "ex4":
		v = float64(wfc.Ex4)

	case "ex5":
		v = float64(wfc.Ex5)
	}

	return v
}
