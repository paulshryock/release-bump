export type NonEmptyStringGeneric<T extends string> = T extends '' ? never : T
export type NonEmptyString = NonEmptyStringGeneric<string>
