package interfaces

type Sockets interface {
	SendMessage(channel string, eventName string, data interface{})
}
