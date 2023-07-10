export interface IJson {
  externalUrl?: string;
  list: { name: string; label: string; type: string }[][];
  title: string;
  view: {
    name: string;
    label: string;
    type: string;
    format?: string;
  }[][];
  main?: {
    name: string;
    label: string;
    type: string;
  }[][];
  idKey?: string;
  titleKeyName?: string;
}
