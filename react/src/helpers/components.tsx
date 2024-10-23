import React from "react";

export function Compose({ items, children }) {
    return items.reduceRight(
        (acc, Component) =>
            React.createElement(Component, {  }, acc),
        children
    );
}