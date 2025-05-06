package product_vo

import (
	"testing"
)

func TestBotGroupCharsToStruct(t *testing.T) {
	jsonStr := `{"ids":"123","name":"Test Group"}`
	expected := BotGroupChars{
		Ids:  "123",
		Name: "Test Group",
	}

	result := BotGroupCharsToStruct(jsonStr)

	if result != expected {
		t.Errorf("expected %+v, got %+v", expected, result)
	}
}

func TestBotGroupCharsToString(t *testing.T) {
	expected := `{"ids":"123","name":"Test Group"}`

	r := BotGroupChars{
		Ids:  "123",
		Name: "Test Group",
	}

	result := r.BotGroupCharsToStr()

	if result != expected {
		t.Errorf("expected %+v, got %+v", expected, result)
	}
}
