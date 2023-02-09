package models

import (
	"go.mongodb.org/mongo-driver/bson"
)

type Workplace struct {
	ID string 		`json: "_id,omitempty"	  bson:"_id,omitempty"`
	Fip string 		`json: "fip,omitempty" 	  bson:"fip,omitempty"`
	Places bson.A 	`json: "places,omitempty" bson:"places,omitempty"`
} 