export enum Direction {
    North,
    South,
    East,
    West
}

export function getDirectionName(direction: Direction): string {
    const directionNames: { [key in Direction]: string } = {
        [Direction.North]: "north",
        [Direction.South]: "south",
        [Direction.East]: "east",
        [Direction.West]: "west"
    };

    return directionNames[direction];
}
