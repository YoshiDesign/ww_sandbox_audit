package models

type School struct {
	ID string `json"_id,omitempty" bson:"_id,omitempty"`
	Fip string `json"fip,omitempty" bson:"fip,omitempty"`
	Dis string `json:"dis,omitempty" bson:"dis,omitempty"`
	Cty string `json:"city,omitempty" bson:"city,omitempty"`
	Co string `json:"co,omitempty" bson:"co,omitempty"`
	NumS string `json:"no_s,omitempty" bson:"no_s,omitempty"`
	Gd string `json:"grade,omitempty" bson:"grade,omitempty"`
	Ns string `json:"no_school,omitempty" bson:"no_school,omitempty"`
}