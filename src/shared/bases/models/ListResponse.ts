export class ResponseState {
    limit: number;
    total: number;
    previous_offset: number;
    next_offset: number;
}

export class ListResponse {
    public results: any[];
    public state?: ResponseState;
  public next?: string;
  public prev?: string;
}

export class ListResponseOfObject {
    public results: Object;
    public state: ResponseState;
}
