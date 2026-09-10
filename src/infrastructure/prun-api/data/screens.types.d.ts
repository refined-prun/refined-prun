declare namespace PrunApi {
  interface Screen {
    id: string;
    name: string;
    hidden: boolean;
    state: UIState[];
  }
}
