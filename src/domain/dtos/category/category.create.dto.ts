export class CategoryCreateDto {


    private constructor(
        public readonly name: string,
        public readonly available: boolean
    ) { }

    static create(object: { [key: string]: any }): [string?, CategoryCreateDto?] {
        const { name, available = false } = object;
        let availableParsed = available;
        if (!name) return ['name is required'];
        if (typeof available !== 'boolean') {
            availableParsed = (available === 'true')
        }
        return [undefined, new CategoryCreateDto(name, availableParsed)];
    }
}