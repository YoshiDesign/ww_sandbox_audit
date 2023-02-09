package models

type User struct {
	ID string 		`json:"_id,omitempty" bson:"_id,omitempty"`
	Email string 	`json:"email,omitempty" bson:"email,omitempty"`
	Password string `json:"password,omitempty" bson:"password,omitempty"`
	Name string 	`json:"name,omitempty" bson:"name,omitempty"`
	Role int		`json:"role,omitempty" bson:"role,omitempty"`
	Created string  `json:"created,omitempty" bson:"created,omitempty"`
}