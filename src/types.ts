export type IData = {
  items: IMessage[];
};

export type IMessage = {
  id: string;
  parentId: string;
  text: string;
  created: string;
};
