export default class Feedback<T> {
    public success: boolean;
    public message: string;
    public result: T;
    public results: T[];
    public page: number;
    public pages: number;
    constructor() { }
}
