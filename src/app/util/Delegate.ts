export type Action<T> = (arg: T) => void;
export type Action2<T1, T2> = (arg1: T1, arg2: T2) => void;
export type Action3<T1, T2, T3> = (arg1: T1, arg2: T2, arg3: T3) => void;

export type Func<A, R> = (arg: A) => R;
export type Func2<A1, A2, R> = (arg1: A1, arg2: A2) => R;
export type Func3<A1, A2, A3, R> = (arg1: A1, arg2: A2, arg3: A3) => R;