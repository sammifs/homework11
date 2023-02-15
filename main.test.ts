import { parse } from "sicp"
import { Value, evaluate, extend_environment, 
        list_of_unassigned, scan_out_declarations, 
        tagged_list_to_record, the_global_environment } from "./main"

function evaluation_tester(input: string): any {
    const env = the_global_environment;
    const program = parse(input);
    const record_program = tagged_list_to_record(program);
    const locals = scan_out_declarations(record_program);
    const unassigneds = list_of_unassigned(locals);
    const program_env = extend_environment(locals, unassigneds, env);
    const output = evaluate(record_program, program_env);
    return output;
}

test("factorial function", () => {
    const factorial_tester = (x: number) => evaluation_tester(`
        function factorial(n) { return n < 2 ? n : n * factorial(n - 1); } factorial(${x});
    `);
    expect(factorial_tester(10)).toBe(3628800);
    expect(factorial_tester(5)).toBe(120);
    expect(factorial_tester(14)).toBe(87178291200);
    expect(factorial_tester(1)).toBe(1);
    expect(factorial_tester(2)).toBe(2);
})

test("binary operation", () => {
    expect(evaluation_tester("1+1;")).toBe(2);
    expect(evaluation_tester("10+51;")).toBe(61);
    expect(evaluation_tester("-1+24;")).toBe(23);
    expect(evaluation_tester("100+-23;")).toBe(77);
    expect(evaluation_tester("-10+-10;")).toBe(-20);

    expect(evaluation_tester("10*10;")).toBe(100);
    expect(evaluation_tester("81/9;")).toBe(9);
    expect(evaluation_tester("100-42;")).toBe(58);
})

test("variable declaration", () => {
    const result = (x: Value) => evaluation_tester(`const a = ${x}; a;`);
    expect(result(10)).toBe(10);
    expect(result(-11*10+7)).toBe(-103);
})

test("lambda expression", () => {
    const result = evaluation_tester("const b = (x) => x * x; b(5);");
    expect(result).toBe(25);
})

test("conditional", () => {
    expect(evaluation_tester("10 > 5;")).toBe(true);
    expect(evaluation_tester("10 < 50;")).toBe(true);
    expect(evaluation_tester("65 > 193;")).toBe(false);
})

test("block", () => {
    const block_test = evaluation_tester("function foo(bar) { const temp = bar; return temp; } foo(5);");
    expect(block_test).toBe(5);
})