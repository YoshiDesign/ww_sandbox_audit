package ww_utils
import (
	"strconv"
	"regexp"
	"context"
)

var Redis_ctx = context.Background()

var ValidQuery = regexp.MustCompile(`^[a-zA-Z0-9\w-+\'.]{0,1000}$`)
var ValidPathLink  = regexp.MustCompile(`^[a-zA-Z0-9/-_]{0,1000}$`)
var ValidName = regexp.MustCompile(`^[a-zA-Z_.0-9 ]{1,36}$`)
var ValidHandle = regexp.MustCompile(`^[a-zA-Z_0-9]{1,25}$`)
var ValidEmail = regexp.MustCompile(`(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])`)
type Error struct {
	Message string `json:"message"`
	Error int `json:"error"`
}

//
func StrInArray(a string, list []string) bool {
    for _, b := range list {
        if b == a {
            return true
        }
    }
    return false
}

//
func IsNumeric(s string) bool {
    _, err := strconv.ParseFloat(s, 64)
    return err == nil
}

// Error message object
func RequestError(n int, m string) Error {
	return Error {
		Message: m,
		Error: n,
	}
}
