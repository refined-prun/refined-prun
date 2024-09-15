declare namespace PrunApi {
  export interface Screen {
    id: string;
    name: string;
    hidden: boolean;
    state: UIState[];
  }
}
