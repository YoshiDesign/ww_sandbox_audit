package ww_utils

import (
	"encoding/base64"
	"crypto/sha256"
	"crypto/hmac"
	"fmt"
	"time"
	"encoding/hex"
	"os"
	"strings"
	"encoding/json"
)

/**
 * @function GenerateToken
 */
func GenerateToken(header string) (string, error) {
	// create a new hash of type sha256. We pass the secret key to it
	h := hmac.New(sha256.New, []byte(os.Getenv("APP_SECRET")))
	payload := map[string]string{
		"aud": "myworldworks",
		"iss": "myworldworks.com",
		"exp": fmt.Sprint(time.Now().Add(time.Minute * 1).Unix()),
	}
	header64 := base64.StdEncoding.EncodeToString([]byte(header))
	// We then Marshal the payload which is a map. This converts it to a string of JSON.
	payloadstr, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("Error generating Token")
		return string(payloadstr), err
	}
	payload64 := base64.StdEncoding.EncodeToString(payloadstr)

	// Now add the encoded string.
	message := header64 + "." + payload64

	// We have the unsigned message ready.
	unsignedStr := header + string(payloadstr)

	// We write this to the SHA256 to hash it.
	h.Write([]byte(unsignedStr))
	signature := base64.StdEncoding.EncodeToString(h.Sum(nil))

	//Finally we have the token
	tokenStr := message + "." + signature
	return tokenStr, nil
}

func HashToString(message string) string {
	h := hmac.New(sha256.New, []byte(os.Getenv("APP_SECRET")))
	h.Write([]byte(message))
	
	hash := hex.EncodeToString(h.Sum(nil))
	fmt.Println("Hash to String: ", hash)
	return hash
}

// ValidMAC reports whether messageMAC is a valid HMAC tag for message.
func ValidMAC(message []byte, messageMAC []byte) bool {
	mac := hmac.New(sha256.New, []byte(os.Getenv("APP_SECRET")))
	mac.Write(message)
	expectedMAC := mac.Sum(nil)
	return hmac.Equal(messageMAC, expectedMAC)
}

/**
 * @function ValidateToken
 */
func ValidateToken(token string, secret string) (bool, error) {

	// TODO - Choose a different convention

	// JWT has 3 parts separated by '.'
	splitToken := strings.Split(token, ".")
	// if length is not 3, we know that the token is corrupt
	if len(splitToken) != 3 {
		return false, nil
	}

	// decode the header and payload back to strings
	header, err := base64.StdEncoding.DecodeString(splitToken[0])
	if err != nil {
		return false, err
	}
	payload, err := base64.StdEncoding.DecodeString(splitToken[1])
	if err != nil {
		return false, err
	}
	//again create the signature
	unsignedStr := string(header) + string(payload)
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(unsignedStr))

	signature := base64.StdEncoding.EncodeToString(h.Sum(nil))
	fmt.Println(signature)

	// if both the signature don’t match, this means token is wrong
	if signature != splitToken[2] {
		return false, nil
	}
	// This means the token matches
	return true, nil
}