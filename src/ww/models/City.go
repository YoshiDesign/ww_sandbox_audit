package models

type City struct {
	ID string `json:"_id,omitempty" bson:"_id,omitempty"`
	Nation_id string `json:"nation_id,omitempty" bson:"nation_id,omitempty"`
	State_id string `json:"state_id,omitempty" bson:"state_id,omitempty"`
	County_id string `json:"county_id,omitempty" bson:"county_id,omitempty"`
	Gro float64 `json:"gro,omitempty" bson:"gro,omitempty"`
	Hea float64 `json:"hea,omitempty" bson:"hea,omitempty"`
	Hou float64 `json:"hou,omitempty" bson:"hou,omitempty"`
	Uti float64 `json:"uti,omitempty" bson:"uti,omitempty"`
	Tra float64 `json:"tra,omitempty" bson:"tra,omitempty"`
	Ent float64 `json:"ent,omitempty" bson:"ent,omitempty"`
	Col float64 `json:"col,omitempty" bson:"col,omitempty"`
	Mhc float64 `json:"mhc,omitempty" bson:"mhc,omitempty"`
	Rav float64 `json:"rav,omitempty" bson:"rav,omitempty"`
	R0 float64 `json:"r0,omitempty" bson:"r0,omitempty"`
	R1 float64 `json:"r1,omitempty" bson:"r1,omitempty"`
	R2 float64 `json:"r2,omitempty" bson:"r2,omitempty"`
	R3 float64 `json:"r3,omitempty" bson:"r3,omitempty"`
	R4 float64 `json:"r4,omitempty" bson:"r4,omitempty"`
	Name string `json:"name,omitempty" bson:"name,omitempty"`
	County_name string `json:"county_name,omitempty" bson:"county_name,omitempty"`
}