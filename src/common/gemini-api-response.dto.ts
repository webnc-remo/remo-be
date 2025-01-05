export interface IGeminiApiResponse {
  status: number;
  data: {
    result: string[];
  };
}

export interface INavigateResponse {
  status: number;
  data: {
    route: string;
    params: {
      movie_ids: string[];
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any;
    is_success: boolean;
  };
}
