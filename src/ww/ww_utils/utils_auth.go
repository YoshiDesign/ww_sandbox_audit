package ww_utils

import (
	"context"
	"fmt"
	"log"

	"dubdub.com/dubdub/ww/models"
	"dubdub.com/dubdub/ww/ww_init"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AuthorizeLogin(email string, passwordHash string) (bool, error) {

	// Search for the user to make sure they exist
	p := bson.M{"name": 1, "handle": 1, "email": 1, "password": 1, "role": 1}
	var user models.User
	findOptions := options.FindOne()
	findOptions.SetProjection(p)
	findConditions := bson.M{"email": email}

	err0 := ww_init.WW_app.MDB.User_collection.FindOne(context.TODO(), findConditions, findOptions).Decode(&user)
	if err0 != nil {
		log.Println(err0)
		return false, err0
	}

	fmt.Println("Hash from pass:", user.Password)
	if passwordHash != user.Password {
		return false, nil
	}
	fmt.Println("Successful Login!")
	return true, nil

}
