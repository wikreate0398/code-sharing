export const withProvider =
    (Provider, args = {}) =>
    (Component) => {
        return (componentProps) => {
            return (
                <Provider {...args}>
                    <Component {...componentProps} />
                </Provider>
            )
        }
    }
