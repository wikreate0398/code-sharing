package custom_errors

type ClientError struct {
	Code    int
	Message error
}

func (err *ClientError) Error() string {
	return err.Message.Error()
}

func (err *ClientError) StatusCode() int {
	return err.Code
}

// ВАЖНО: реализуем Unwrap, чтобы errors.Is/As работали
func (err *ClientError) Unwrap() error {
	return err.Message
}
