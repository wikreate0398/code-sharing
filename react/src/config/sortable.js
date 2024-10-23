import { PointerSensor, useSensor } from '@dnd-kit/core'

export const usePointerSensor = () => {
    return useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3
        }
    })
}
