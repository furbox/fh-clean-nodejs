export class PaginationDto {


    private constructor(
        public readonly page: number,
        public readonly limit: number
    ) { }

    static create(page: number = 1, limit: number = 12): [string?, PaginationDto?] {
        if (!Number.isInteger(limit)) {
            return ['Limit must be an integer'];
        }
        if (!Number.isInteger(page)) {
            return ['Page must be an integer'];
        }
        if (limit <= 0) {
            return ['Limit must be greater than 0'];
        }
        if (page <= 0) {
            return ['Page must be greater than 0'];
        }
        
       
        return [undefined, new PaginationDto(page, limit)];
    }
}