package models

type County struct {
	ID string 			`json:"_id,omitempty" bson:"_id,omitempty"`
	Nation_id string	`json:"nation_id,omitempty" bson:"nation_id,omitempty"`
	Name string			`json:"name,omitempty" bson:"name,omitempty"`
	State_id string		`json:"state_id,omitempty" bson:"state_id,omitempty"`
	Fip string			`json:"fip,omitempty" bson:"fip,omitempty"`
	Col int				`json:"col,omitempty" bson:"col,omitempty"`
	Rav float64			`json:"rav,omitempty" bson:"rav,omitempty"`
	R0 int				`json:"r0,omitempty" bson:"r0,omitempty"`
	R1 int				`json:"r1,omitempty" bson:"r1,omitempty"`
	R2 int				`json:"r2,omitempty" bson:"r2,omitempty"`
	R3 int				`json:"r3,omitempty" bson:"r3,omitempty"`
	R4 int				`json:"r4,omitempty" bson:"r4,omitempty"`
	Mhc int				`json:"mhc,omitempty" bson:"mhc,omitempty"`
	Noc int				`json:"noc,omitempty" bson:"noc,omitempty"`
}