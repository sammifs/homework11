declare module 'sicp';

type Pair<H, T> = [H, T];
type List<T> = [T, List<T>] | null;

declare function is_boolean(value: any): boolean;
declare function set_head<H, T>(pair: Pair<H, T>, elem: H): Pair<H, T>;
declare function is_pair(value: any): boolean;
declare function list_ref(list: any, index: number): any;
declare function apply_in_underlying_javascript(f: any, args: any): any;
declare function pair<H,T>(head: H, tail: T): Pair<H, T>;
declare function stringify(value: any): string;
declare function is_null(value: any): boolean;
declare function error(...args: [any]): any;
declare function math_abs(value: number): number;
declare const math_PI: number;
declare const math_E: number;
declare function display(...x: any[]): any;
declare function map<H, T>(fun: (from: H) => T, list: List<H>): List<T>;
declare function accumulate(x: any): any;
declare function parse(x: any): any;
declare function append<T>(a: List<T>, b: List<T>): List<T>;
declare function head<H, T>(pair: Pair<H, T>): H;
declare function list<T>(...elems: [T]): List<T>;
declare function tail<H, T>(pair: Pair<H, T>): T;


