export interface MessagePackObject<T> {
    readonly packed: T;
}

export type PackedEnum = number;

type Unpackable<T> = T extends { unpack: (data: any) => infer U } ? U : never;
