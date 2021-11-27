import { GetVideoCardReqDto } from "../getVideoCardReqDto";

describe('getVideoCardReqDto', () => {
    it('should set default offset/limit if not defined', () => {
        const VERSION = 'DDR4'
        const query = new GetVideoCardReqDto(undefined, undefined, VERSION)
        expect(query.limit).toBe(20)
        expect(query.offset).toBe(0)
        expect(query.version).toBe(VERSION)
    });
    it('should set offset/limit with given params', () => {
        const VERSION = 'DDR4'
        const LIMIT = 5
        const OFFSET = 20
        const query = new GetVideoCardReqDto(LIMIT, OFFSET, VERSION)
        expect(query.limit).toBe(LIMIT)
        expect(query.offset).toBe(OFFSET)
        expect(query.version).toBe(VERSION)
    });
});