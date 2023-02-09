package ww_api

import (
	"context"
	"fmt"
	"log"
	"time"

	// "crypto/sha256"
	// "crypto/hmac"

	"go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo/options"

	"dubdub.com/dubdub/ww/ww_init"
	"dubdub.com/dubdub/ww/ww_utils"
	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {

	fmt.Println("Logging in...")
	data := new(ww_utils.UserLoginRequest)

	fmt.Println("Email:", data.Email)

	if err := c.BodyParser(data); err != nil {
		fmt.Println("[Login - 1]", err)
		return c.JSON(ww_utils.RequestError(1, "[Login - 1] Something went wrong, please try again later."))
	}

	// Invalid string
	if !ww_utils.ValidEmail.MatchString(data.Email) {
		return c.JSON(ww_utils.RequestError(2, "Those credentials do not match our records."))
	}

	success, err := ww_utils.AuthorizeLogin(data.Email, ww_utils.HashToString(data.Password))

	if !success {
		return c.JSON(ww_utils.RequestError(2, "Those credentials do not match our records."))
	}
	if err != nil {

		log.Println(err)
	}
	token, err := ww_utils.GenerateToken("WW Signup Token")
	if err != nil {
		fmt.Println("Failed to generate Token", err)
		return c.JSON(ww_utils.RequestError(2, "[2] Something went wrong, please try again later."))
	}

	return c.JSON(ww_utils.AuthenticatedResponse{Success: true, Token: token})
}

func Signup(c *fiber.Ctx) error {

	data := new(ww_utils.UserSignupRequest)

	if err := c.BodyParser(data); err != nil {
		fmt.Println(err)
		return c.JSON(ww_utils.RequestError(1, "[1] Something went wrong, please try again later."))
	}

	if !ww_utils.ValidName.MatchString(data.Name) {
		return c.JSON(ww_utils.RequestError(1, "Names may contain letters, numbers, dots, underscores and spaces. Maximum of 36 characters."))
	}
	if !ww_utils.ValidHandle.MatchString(data.Handle) {
		return c.JSON(ww_utils.RequestError(1, "Handles may contain letters, numbers and underscores. Maximum of 25 characters."))
	}
	if !ww_utils.ValidEmail.MatchString(data.Email) {
		return c.JSON(ww_utils.RequestError(1, "Your email address isn't valid."))
	}
	if data.Password != data.PasswordConfirm {
		return c.JSON(ww_utils.RequestError(1, "Passwords do not match."))
	}
	if !data.Agree {
		return c.JSON(ww_utils.RequestError(1, "You must agree to our terms to continue."))
	}

	token, err := ww_utils.GenerateToken("WW Signup Token")

	if err != nil {
		fmt.Println("Failed to generate Token")
		return c.JSON(ww_utils.RequestError(2, "[2] Something went wrong, please try again later."))
	}

	// Store the account
	_, err = ww_init.WW_app.MDB.User_collection.InsertOne(context.Background(), bson.M{"name": data.Name, "handle": data.Handle, "email": data.Email, "password": ww_utils.HashToString(data.Password), "role": 0, "created": time.Now()})
	if err != nil {
		fmt.Println("Error during account creation", err)
		return c.JSON(ww_utils.RequestError(3, "[3] Something went wrong, please try again later."))
	}
	// id := res.InsertedID

	// Just for reference
	// x, err := json.Marshal(&data)
	// if (err != nil) {
	// 	return c.JSON(`{"fail": true}`)
	// }
	// success.Data = string(x)

	// Set the Auth Cookie
	cookie := new(fiber.Cookie)
	cookie.Name = "ww_session"
	cookie.Value = token
	cookie.Expires = time.Now().Add(24 * time.Hour)

	// Set cookie
	c.Cookie(cookie)

	// Success
	return c.JSON(ww_utils.AuthenticatedResponse{Success: true, Token: token})

}
func Logout(c *fiber.Ctx) error {

	// 	// Destroy the Auth Cookie
	// 	cookie := new(fiber.Cookie)
	// 	cookie.Name = "ww_session"
	// 	cookie.Value = token
	// 	cookie.Expires = time.Now().Sub(24 * time.Hour)

	// 	// Set cookie
	// 	c.Cookie(cookie)

	return c.JSON(make(map[string]string))

}

// app.Post("/users/reserve", func(c *fiber.Ctx) error {

// 	// If this were a POST request, we'd get our vars like this
// 	data := new(userSignupRequest)
// 	if err := c.BodyParser(data); err != nil {
// 		fmt.Println(err)
//         return c.JSON(ww_utils.RequestError(1, "/api/datas/col Invalid Request"))
// 	}

// 	// TODO
// 	// firstname := strings.ToLower(data.Firstname)
// 	// lastname := strings.ToLower(data.Lastname)

// 	return c.JSON(userSignupResponse{true})

// })
