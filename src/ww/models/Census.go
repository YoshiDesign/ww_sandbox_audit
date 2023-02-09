package models

// Census data for hovered counties [Redis]
type Census struct {
	Pop_1 string	`json:"pop_1,omitempty"`
	Pop_2 string	`json:"pop_2,omitempty"`
	Pop_3 string	`json:"pop_3,omitempty"`
	Age_3 string	`json:"age_3,omitempty"`
	Age_4 string	`json:"age_4,omitempty"`
	Hou_1 string	`json:"hou_1,omitempty"`
	Hou_2 string	`json:"hou_2,omitempty"`
	Hou_4 string	`json:"hou_4,omitempty"`
	Inc_1 string	`json:"inc_1,omitempty"`
	Inc_3 string	`json:"inc_3,omitempty"`
	Bus_1 string	`json:"bus_1,omitempty"`
	Geo_1 string	`json:"geo_1,omitempty"`
	Geo_2 string	`json:"geo_2,omitempty"`
	Edu_1 string	`json:"edu_1,omitempty"`
	Edu_2 string	`json:"edu_2,omitempty"`
	Hou_6 string	`json:"hou_6,omitempty"`
}