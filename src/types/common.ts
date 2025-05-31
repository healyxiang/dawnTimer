export type NonUndefined<T> = T extends undefined ? never : T;

export type CoreContent<T> = Omit<T, "body" | "_raw" | "_id">;

export interface BaseModel {
  id: string;
  //   createdAt: string;
  //   updatedAt: string;
}
