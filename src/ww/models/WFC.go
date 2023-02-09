package models

type WFC struct {
	ID string 			 `json:"_id,omitempty" bson:"_id,omitempty"`
	County_id string 	 `json:"county_id,omitempty" bson"county_id,omitempty"`
	Occupation_id string `json:"occupation_id,omitempty" bson"occupation_id,omitempty"`
	Lq  float64 `json:"lq,omitempty" bson:"lq,omitempty"`
	Pk  float64 `json:"pk,omitempty" bson:"pk,omitempty"`
	Em  float64 `json:"em,omitempty" bson:"em,omitempty"`
	Ex0 float64 `json:"ex0,omitempty" bson:"ex0,omitempty"` 
	Ex1 float64 `json:"ex1,omitempty" bson:"ex1,omitempty"` 
	Ex2 float64 `json:"ex2,omitempty" bson:"ex2,omitempty"` 
	Ex3 float64 `json:"ex3,omitempty" bson:"ex3,omitempty"` 
	Ex4 float64 `json:"ex4,omitempty" bson:"ex4,omitempty"` 
	Ex5 float64 `json:"ex5,omitempty" bson:"ex5,omitempty"` 
}