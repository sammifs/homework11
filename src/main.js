"use strict";
exports.__esModule = true;
var PromptSync = require("prompt-sync");
var prompt = PromptSync({ sigint: true });
var sicp_1 = require("sicp");
function tagged_list_to_record(component) {
    function is_statement(c) {
        var tag = (0, sicp_1.head)(c);
        return tag === "block" || tag === "sequence" ||
            tag === "function_declaration" || tag === "constant_declaration" || tag === "assignment" ||
            tag === "return_statement";
    }
    function is_expression(c) {
        var tag = (0, sicp_1.head)(c);
        return tag === "conditional_expression" || tag === "lambda_expression" ||
            tag === "name" || tag === "literal" || tag === "application" ||
            tag === "unary_operator_combination" || tag === "binary_operator_combination";
    }
    function is_tagged_list(component, the_tag) {
        return (0, sicp_1.is_pair)(component) && (0, sicp_1.head)(component) === the_tag;
    }
    function is_literal(component) {
        return is_tagged_list(component, "literal");
    }
    function is_name(component) {
        return is_tagged_list(component, "name");
    }
    function is_assignment(component) {
        return is_tagged_list(component, "assignment");
    }
    function is_declaration(component) {
        return is_tagged_list(component, "constant_declaration") ||
            is_tagged_list(component, "variable_declaration") ||
            is_tagged_list(component, "function_declaration");
    }
    function is_lambda_expression(component) {
        return is_tagged_list(component, "lambda_expression");
    }
    function is_function_declaration(component) {
        return is_tagged_list(component, "function_declaration");
    }
    function is_return_statement(component) {
        return is_tagged_list(component, "return_statement");
    }
    function is_conditional(component) {
        return is_tagged_list(component, "conditional_expression") ||
            is_tagged_list(component, "conditional_statement");
    }
    function is_sequence(stmt) {
        return is_tagged_list(stmt, "sequence");
    }
    function is_block(component) {
        return is_tagged_list(component, "block");
    }
    function is_operator_combination(component) {
        return is_unary_operator_combination(component) ||
            is_binary_operator_combination(component);
    }
    function is_unary_operator_combination(component) {
        return is_tagged_list(component, "unary_operator_combination");
    }
    function is_binary_operator_combination(component) {
        return is_tagged_list(component, "binary_operator_combination");
    }
    function is_application(component) {
        return is_tagged_list(component, "application");
    }
    // Transformers
    function transform_name(name) {
        return { tag: "name", symbol: (0, sicp_1.head)((0, sicp_1.tail)(name)) };
    }
    function transform_literal(literal) {
        return { tag: "literal", value: (0, sicp_1.head)((0, sicp_1.tail)(literal)) };
    }
    function transform_application(app) {
        return { tag: "application", function_expression: transform_expression((0, sicp_1.head)((0, sicp_1.tail)(app))), arguments: (0, sicp_1.map)(tagged_list_to_record, (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(app)))) };
    }
    function transform_operator_combination(op) {
        var operator = (0, sicp_1.head)((0, sicp_1.tail)(op));
        var operands = (0, sicp_1.map)(transform_expression, (0, sicp_1.tail)((0, sicp_1.tail)(op)));
        return (0, sicp_1.head)(op) === "unary_operator_combination"
            ? { tag: "unary_operator_combination", operator: operator, operand: (0, sicp_1.list_ref)(operands, 0) }
            : { tag: "binary_operator_combination", operator: operator, left: (0, sicp_1.list_ref)(operands, 0), right: (0, sicp_1.list_ref)(operands, 1) };
    }
    function transform_conditional(cond) {
        return { tag: (0, sicp_1.head)(cond), predicate: transform_expression((0, sicp_1.list_ref)(cond, 1)), consequent: transform_component((0, sicp_1.list_ref)(cond, 2)), alternative: transform_component((0, sicp_1.list_ref)(cond, 3)) };
    }
    function transform_lambda(lam) {
        return { tag: "lambda_expression", parameters: (0, sicp_1.map)(transform_name, (0, sicp_1.list_ref)(lam, 1)), body: transform_component((0, sicp_1.list_ref)(lam, 2)) };
    }
    function transform_sequence(seq) {
        return { tag: "sequence", statements: (0, sicp_1.map)(transform_component, (0, sicp_1.list_ref)(seq, 1)) };
    }
    function transform_block(block) {
        return { tag: "block", body: (0, sicp_1.map)(transform_statement, (0, sicp_1.list_ref)(block, 0)) };
    }
    function transform_return_statement(ret) {
        return { tag: "return_statement", return_expression: transform_expression((0, sicp_1.list_ref)(ret, 1)) };
    }
    function transform_function_declaration(fun) {
        return { tag: "function_declaration", name: transform_name((0, sicp_1.list_ref)(fun, 1)), parameters: (0, sicp_1.map)(transform_name, (0, sicp_1.list_ref)(fun, 2)), body: transform_component((0, sicp_1.list_ref)(fun, 3)) };
    }
    function transform_declaration(decl) {
        return { tag: "constant_declaration", name: transform_name((0, sicp_1.list_ref)(decl, 1)), initialiser: transform_expression((0, sicp_1.list_ref)(decl, 2)) };
    }
    function transform_assignment(assg) {
        return { tag: "assignment", name: transform_name((0, sicp_1.list_ref)(assg, 1)), right_hand_side: transform_expression((0, sicp_1.list_ref)(assg, 2)) };
    }
    function transform_component(component) {
        return is_expression(component)
            ? transform_expression(component)
            : is_statement(component)
                ? transform_statement(component)
                : (0, sicp_1.error)(component, "unknown syntax -- record transformation");
    }
    function transform_statement(exp) {
        return is_sequence(exp)
            ? transform_sequence(exp)
            : is_block(exp)
                ? transform_block(exp)
                : is_return_statement(exp)
                    ? transform_return_statement(exp)
                    : is_function_declaration(exp)
                        ? transform_function_declaration(exp)
                        : is_declaration(exp)
                            ? transform_declaration(exp)
                            : is_assignment(exp)
                                ? transform_assignment(exp)
                                : (0, sicp_1.error)(exp, "Not a statement!");
    }
    function transform_expression(exp) {
        return is_literal(exp)
            ? transform_literal(exp)
            : is_name(exp)
                ? transform_name(exp)
                : is_application(exp)
                    ? transform_application(exp)
                    : is_operator_combination(exp)
                        ? transform_operator_combination(exp)
                        : is_conditional(exp)
                            ? transform_conditional(exp)
                            : is_lambda_expression(exp)
                                ? transform_lambda(exp)
                                : (0, sicp_1.error)(exp, "Not an expression!");
    }
    return transform_component(component);
}
function incremental_transform(component) {
    function is_statement(c) {
        var tag = (0, sicp_1.head)(c);
        return tag === "block" || tag === "sequence" ||
            tag === "function_declaration" || tag === "constant_declaration" || tag === "assignment" ||
            tag === "return_statement";
    }
    function is_expression(c) {
        var tag = (0, sicp_1.head)(c);
        return tag === "conditional_expression" || tag === "lambda_expression" ||
            tag === "name" || tag === "literal" || tag === "application" ||
            tag === "unary_operator_combination" || tag === "binary_operator_combination";
    }
    function is_tagged_list(component, the_tag) {
        return (0, sicp_1.is_pair)(component) && (0, sicp_1.head)(component) === the_tag;
    }
    function is_literal(component) {
        return is_tagged_list(component, "literal");
    }
    function is_name(component) {
        return is_tagged_list(component, "name");
    }
    function is_assignment(component) {
        return is_tagged_list(component, "assignment");
    }
    function is_declaration(component) {
        return is_tagged_list(component, "constant_declaration") ||
            is_tagged_list(component, "variable_declaration") ||
            is_tagged_list(component, "function_declaration");
    }
    function is_lambda_expression(component) {
        return is_tagged_list(component, "lambda_expression");
    }
    function is_function_declaration(component) {
        return is_tagged_list(component, "function_declaration");
    }
    function is_return_statement(component) {
        return is_tagged_list(component, "return_statement");
    }
    function is_conditional(component) {
        return is_tagged_list(component, "conditional_expression") ||
            is_tagged_list(component, "conditional_statement");
    }
    function is_sequence(stmt) {
        return is_tagged_list(stmt, "sequence");
    }
    function is_block(component) {
        return is_tagged_list(component, "block");
    }
    function is_operator_combination(component) {
        return is_unary_operator_combination(component) ||
            is_binary_operator_combination(component);
    }
    function is_unary_operator_combination(component) {
        return is_tagged_list(component, "unary_operator_combination");
    }
    function is_binary_operator_combination(component) {
        return is_tagged_list(component, "binary_operator_combination");
    }
    function is_application(component) {
        return is_tagged_list(component, "application");
    }
    // Transformers
    function transform_name(name) {
        // return name as unknown as Name;
        return { tag: "name", symbol: (0, sicp_1.head)((0, sicp_1.tail)(name)) };
    }
    function transform_literal(literal) {
        //return literal as unknown as Literal;
        return { tag: "literal", value: (0, sicp_1.head)((0, sicp_1.tail)(literal)) };
    }
    function transform_application(app) {
        return (0, sicp_1.list)((0, sicp_1.head)(app), transform_expression((0, sicp_1.head)((0, sicp_1.tail)(app))), (0, sicp_1.map)(incremental_transform, (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(app)))));
        // return { tag: "application", function_expression: transform_expression(head(tail(app))), arguments: map(incremental_transform, head(tail(tail(app)))) };
    }
    function transform_operator_combination(op) {
        //return append(list(head(op), head(tail(op))), map(transform_component, tail(tail(op))));
        var operator = (0, sicp_1.head)((0, sicp_1.tail)(op));
        var operands = (0, sicp_1.map)(transform_expression, (0, sicp_1.tail)((0, sicp_1.tail)(op)));
        return (0, sicp_1.head)(op) === "unary_operator_combination"
            ? { tag: "unary_operator_combination", operator: operator, operand: (0, sicp_1.list_ref)(operands, 0) }
            : { tag: "binary_operator_combination", operator: operator, left: (0, sicp_1.list_ref)(operands, 0), right: (0, sicp_1.list_ref)(operands, 1) };
    }
    function transform_conditional(cond) {
        return (0, sicp_1.list)((0, sicp_1.head)(cond), transform_expression((0, sicp_1.list_ref)(cond, 1)), transform_component((0, sicp_1.list_ref)(cond, 2)), transform_component((0, sicp_1.list_ref)(cond, 3)));
        // return { tag: head(cond), predicate: transform_expression(list_ref(cond, 1)), consequent: transform_component(list_ref(cond, 2)), alternative: transform_component(list_ref(cond, 3)) };
    }
    function transform_lambda(lam) {
        return (0, sicp_1.list)((0, sicp_1.head)(lam), (0, sicp_1.map)(transform_component, (0, sicp_1.list_ref)(lam, 1)), transform_component((0, sicp_1.list_ref)(lam, 2)));
        // return { tag: "lambda_expression", parameters: map(transform_name, list_ref(lam, 1)), body: transform_component(list_ref(lam, 2)) };
    }
    function transform_sequence(seq) {
        return (0, sicp_1.list)((0, sicp_1.head)(seq), (0, sicp_1.map)(transform_component, (0, sicp_1.list_ref)(seq, 1)));
        // return { tag: "sequence", statements: map(transform_component, list_ref(seq, 1)) };
    }
    function transform_block(block) {
        return (0, sicp_1.list)((0, sicp_1.head)(block), (0, sicp_1.map)(transform_component, (0, sicp_1.list_ref)(block, 1)));
        // return { tag: "block", body: map(transform_statement, list_ref(block, 1)) };
    }
    function transform_return_statement(ret) {
        return (0, sicp_1.list)((0, sicp_1.head)(ret), transform_expression((0, sicp_1.list_ref)(ret, 1)));
        // return { tag: "return_statement", return_expression: transform_expression(list_ref(ret, 1)) };
    }
    function transform_function_declaration(fun) {
        return (0, sicp_1.list)("function_declaration", transform_name((0, sicp_1.list_ref)(fun, 1)), (0, sicp_1.map)(transform_name, (0, sicp_1.list_ref)(fun, 2)), transform_component((0, sicp_1.list_ref)(fun, 3)));
        // return { tag: "function_declaration", name: transform_name(list_ref(fun, 1)), parameters: map(transform_name, list_ref(fun, 2)), body: transform_component(list_ref(fun, 3)) };
    }
    function transform_declaration(decl) {
        return (0, sicp_1.list)("constant_declaration", transform_name((0, sicp_1.list_ref)(decl, 1)), transform_expression((0, sicp_1.list_ref)(decl, 2)));
        // return { tag: "constant_declaration", name: transform_name(list_ref(decl, 1)), initialiser: transform_expression(list_ref(decl, 2)) };
    }
    function transform_assignment(assg) {
        return (0, sicp_1.list)("assignment", transform_name((0, sicp_1.list_ref)(assg, 1)), transform_expression((0, sicp_1.list_ref)(assg, 2)));
        // return { tag: "assignment", name: transform_name(list_ref(assg, 1)), right_hand_side: transform_expression(list_ref(assg, 2)) };
    }
    function transform_component(component) {
        return is_expression(component)
            ? transform_expression(component)
            : is_statement(component)
                ? transform_statement(component)
                : (0, sicp_1.error)(component, "unknown syntax -- record transformation");
    }
    function transform_statement(exp) {
        return is_sequence(exp)
            ? transform_sequence(exp)
            : is_block(exp)
                ? transform_block(exp)
                : is_return_statement(exp)
                    ? transform_return_statement(exp)
                    : is_function_declaration(exp)
                        ? transform_function_declaration(exp)
                        : is_declaration(exp)
                            ? transform_declaration(exp)
                            : is_assignment(exp)
                                ? transform_assignment(exp)
                                : (0, sicp_1.error)(exp, "Not a statement!");
    }
    function transform_expression(exp) {
        return is_literal(exp)
            ? transform_literal(exp)
            : is_name(exp)
                ? transform_name(exp)
                : is_application(exp)
                    ? transform_application(exp)
                    : is_operator_combination(exp)
                        ? transform_operator_combination(exp)
                        : is_conditional(exp)
                            ? transform_conditional(exp)
                            : is_lambda_expression(exp)
                                ? transform_lambda(exp)
                                : (0, sicp_1.error)(exp, "Not an expression!");
    }
    return transform_component(component);
}
// SICP JS 3.1.4
// functions from SICP JS 4.1.1
function evaluate(component, env) {
    return is_literal(component)
        ? literal_value(component)
        : is_name(component)
            ? lookup_symbol_value(symbol_of_name(component), env)
            : is_application(component)
                ? apply(evaluate(function_expression(component), env), list_of_values(arg_expressions(component), env))
                : is_operator_combination(component)
                    ? evaluate(operator_combination_to_application(component), env)
                    : is_conditional(component)
                        ? eval_conditional(component, env)
                        : is_lambda_expression(component)
                            ? make_function(lambda_parameter_symbols(component), lambda_body(component), env)
                            : is_sequence(component)
                                ? eval_sequence(sequence_statements(component), env)
                                : is_block(component)
                                    ? eval_block(component, env)
                                    : is_return_statement(component)
                                        ? eval_return_statement(component, env)
                                        : is_function_declaration(component)
                                            ? evaluate(function_decl_to_constant_decl(component), env)
                                            : is_declaration(component)
                                                ? eval_declaration(component, env)
                                                : is_assignment(component)
                                                    ? eval_assignment(component, env)
                                                    : (0, sicp_1.error)(component, "unknown syntax -- evaluate");
}
function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    }
    else if (is_compound_function(fun)) {
        var result = evaluate(function_body(fun), extend_environment(function_parameters(fun), args, function_environment(fun)));
        return is_return_value(result)
            ? return_value_content(result)
            : undefined;
    }
    else {
        (0, sicp_1.error)(fun, "unknown function type -- apply");
    }
}
function list_of_values(exps, env) {
    return (0, sicp_1.map)(function (arg) { return evaluate(arg, env); }, exps);
}
function eval_conditional(component, env) {
    return is_truthy(evaluate(conditional_predicate(component), env))
        ? evaluate(conditional_consequent(component), env)
        : evaluate(conditional_alternative(component), env);
}
function eval_sequence(stmts, env) {
    if (is_empty_sequence(stmts)) {
        return undefined;
    }
    else if (is_last_statement(stmts)) {
        return evaluate(first_statement(stmts), env);
    }
    else {
        var first_stmt_value = evaluate(first_statement(stmts), env);
        if (is_return_value(first_stmt_value)) {
            return first_stmt_value;
        }
        else {
            return eval_sequence(rest_statements(stmts), env);
        }
    }
}
function scan_out_declarations(component) {
    return is_sequence(component)
        ? (0, sicp_1.accumulate)(sicp_1.append, null, (0, sicp_1.map)(scan_out_declarations, sequence_statements(component)))
        : is_declaration(component)
            ? (0, sicp_1.list)(declaration_symbol(component))
            : null;
}
function eval_block(component, env) {
    var body = block_body(component);
    var locals = scan_out_declarations(body);
    var unassigneds = list_of_unassigned(locals);
    return evaluate(body, extend_environment(locals, unassigneds, env));
}
function list_of_unassigned(symbols) {
    return (0, sicp_1.map)(function (_) { return "*unassigned*"; }, symbols);
}
function eval_return_statement(component, env) {
    return make_return_value(evaluate(return_expression(component), env));
}
function eval_assignment(component, env) {
    var value = evaluate(assignment_value_expression(component), env);
    assign_symbol_value(assignment_symbol(component), value, env);
    return value;
}
function eval_declaration(component, env) {
    assign_symbol_value(declaration_symbol(component), evaluate(declaration_value_expression(component), env), env);
    return undefined;
}
// functions from SICP JS 4.1.2
function is_tagged_list(component, the_tag) {
    return (0, sicp_1.is_pair)(component) && (0, sicp_1.head)(component) === the_tag;
}
function is_literal(component) {
    return component.tag === "literal" ? true : false;
}
function literal_value(component) {
    return component.value;
}
function make_literal(value) {
    return (0, sicp_1.list)("literal", value);
}
function is_name(component) {
    return is_tagged_list(component, "name");
}
function make_name(symbol) {
    return (0, sicp_1.list)("name", symbol);
}
function symbol_of_name(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)(component));
}
function is_assignment(component) {
    return is_tagged_list(component, "assignment");
}
function assignment_symbol(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.head)((0, sicp_1.tail)(component))));
}
function assignment_value_expression(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(component)));
}
function is_declaration(component) {
    return is_tagged_list(component, "constant_declaration") ||
        is_tagged_list(component, "variable_declaration") ||
        is_tagged_list(component, "function_declaration");
}
function declaration_symbol(component) {
    return symbol_of_name((0, sicp_1.list_ref)(component, 1));
}
function declaration_value_expression(component) {
    return (0, sicp_1.list_ref)(component, 2);
}
function make_constant_declaration(name, value_expression) {
    return (0, sicp_1.list)("constant_declaration", name, value_expression);
}
function is_lambda_expression(component) {
    return is_tagged_list(component, "lambda_expression");
}
function lambda_parameter_symbols(component) {
    return (0, sicp_1.map)(symbol_of_name, (0, sicp_1.head)((0, sicp_1.tail)(component)));
}
function lambda_body(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(component)));
}
function make_lambda_expression(parameters, body) {
    return (0, sicp_1.list)("lambda_expression", parameters, body);
}
function is_function_declaration(component) {
    return is_tagged_list(component, "function_declaration");
}
function function_declaration_name(component) {
    // return list_ref(component, 1);
    return (0, sicp_1.head)((0, sicp_1.tail)(component));
}
function function_declaration_parameters(component) {
    // return list_ref(component, 2);
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(component)));
}
function function_declaration_body(component) {
    return (0, sicp_1.list_ref)(component, 3);
}
function function_decl_to_constant_decl(component) {
    return make_constant_declaration(function_declaration_name(component), make_lambda_expression(function_declaration_parameters(component), function_declaration_body(component)));
}
function is_return_statement(component) {
    return is_tagged_list(component, "return_statement");
}
function return_expression(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)(component));
}
function is_conditional(component) {
    return is_tagged_list(component, "conditional_expression") ||
        is_tagged_list(component, "conditional_statement");
}
function conditional_predicate(component) {
    return (0, sicp_1.list_ref)(component, 1);
}
function conditional_consequent(component) {
    return (0, sicp_1.list_ref)(component, 2);
}
function conditional_alternative(component) {
    return (0, sicp_1.list_ref)(component, 3);
}
function is_sequence(stmt) {
    return is_tagged_list(stmt, "sequence");
}
function sequence_statements(stmt) {
    return (0, sicp_1.head)((0, sicp_1.tail)(stmt));
}
function first_statement(stmts) {
    return (0, sicp_1.head)(stmts);
}
function rest_statements(stmts) {
    return (0, sicp_1.tail)(stmts);
}
function is_empty_sequence(stmts) {
    return (0, sicp_1.is_null)(stmts);
}
function is_last_statement(stmts) {
    return (0, sicp_1.is_null)((0, sicp_1.tail)(stmts));
}
function is_block(component) {
    return is_tagged_list(component, "block");
}
function block_body(component) {
    return component.body;
}
function make_block(statement) {
    return (0, sicp_1.list)("block", statement);
}
function is_operator_combination(component) {
    return is_unary_operator_combination(component) ||
        is_binary_operator_combination(component);
}
function is_unary_operator_combination(component) {
    return component.tag === "unary_operator_combination" ? true : false;
}
function is_binary_operator_combination(component) {
    return component.tag === "binary_operator_combination" ? true : false;
}
function operator_symbol(component) {
    return component.operator;
}
function first_operand(component) {
    return component.tag === "unary_operator_combination"
        ? component.operand
        : component.left;
}
function second_operand(component) {
    return component.right;
}
function make_application(function_expression, argument_expressions) {
    return (0, sicp_1.list)("application", function_expression, argument_expressions);
}
function operator_combination_to_application(component) {
    var operator = operator_symbol(component);
    return is_unary_operator_combination(component)
        ? make_application(make_name(operator), (0, sicp_1.list)(first_operand(component)))
        : make_application(make_name(operator), (0, sicp_1.list)(first_operand(component), second_operand(component)));
}
function is_application(component) {
    return is_tagged_list(component, "application");
}
function function_expression(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)(component));
}
function arg_expressions(component) {
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(component)));
}
// functions from SICP JS 4.1.3
function is_truthy(x) {
    return (0, sicp_1.is_boolean)(x)
        ? x
        : (0, sicp_1.error)(x, "boolean expected, received");
}
function is_falsy(x) { return !is_truthy(x); }
function make_function(parameters, body, env) {
    return (0, sicp_1.list)("compound_function", parameters, body, env);
}
function is_compound_function(f) {
    return is_tagged_list(f, "compound_function");
}
function function_parameters(f) {
    return (0, sicp_1.head)((0, sicp_1.tail)(f));
}
function function_body(f) {
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)(f)));
}
function function_environment(f) {
    return (0, sicp_1.head)((0, sicp_1.tail)((0, sicp_1.tail)((0, sicp_1.tail)(f))));
}
function make_return_value(content) {
    return (0, sicp_1.list)("return_value", content);
}
function is_return_value(value) {
    return is_tagged_list(value, "return_value");
}
function return_value_content(value) {
    return (0, sicp_1.head)((0, sicp_1.tail)(value));
}
function enclosing_environment(env) { return (0, sicp_1.tail)(env); }
function first_frame(env) { return (0, sicp_1.head)(env); }
var the_empty_environment = null;
function make_frame(symbols, values) { return (0, sicp_1.pair)(symbols, values); }
function frame_symbols(frame) { return (0, sicp_1.head)(frame); }
function frame_values(frame) { return (0, sicp_1.tail)(frame); }
function extend_environment(symbols, vals, base_env) {
    return (0, sicp_1.length)(symbols) === (0, sicp_1.length)(vals)
        ? (0, sicp_1.pair)(make_frame(symbols, vals), base_env)
        : (0, sicp_1.length)(symbols) < (0, sicp_1.length)(vals)
            ? (0, sicp_1.error)("too many arguments supplied: " +
                (0, sicp_1.stringify)(symbols) + ", " +
                (0, sicp_1.stringify)(vals))
            : (0, sicp_1.error)("too few arguments supplied: " +
                (0, sicp_1.stringify)(symbols) + ", " +
                (0, sicp_1.stringify)(vals));
}
function lookup_symbol_value(symbol, env) {
    function env_loop(env) {
        function scan(symbols, vals) {
            return (0, sicp_1.is_null)(symbols)
                ? env_loop(enclosing_environment(env))
                : symbol === (0, sicp_1.head)(symbols)
                    ? (0, sicp_1.head)(vals)
                    : scan((0, sicp_1.tail)(symbols), (0, sicp_1.tail)(vals));
        }
        if (env === the_empty_environment) {
            (0, sicp_1.error)(symbol, "unbound name");
        }
        else {
            var frame = first_frame(env);
            return scan(frame_symbols(frame), frame_values(frame));
        }
    }
    return env_loop(env);
}
function assign_symbol_value(symbol, val, env) {
    function env_loop(env) {
        function scan(symbols, vals) {
            return (0, sicp_1.is_null)(symbols)
                ? env_loop(enclosing_environment(env))
                : symbol === (0, sicp_1.head)(symbols)
                    ? (0, sicp_1.set_head)(vals, val)
                    : scan((0, sicp_1.tail)(symbols), (0, sicp_1.tail)(vals));
        }
        if (env === the_empty_environment) {
            (0, sicp_1.error)(symbol, "unbound name -- assignment");
        }
        else {
            var frame = first_frame(env);
            return scan(frame_symbols(frame), frame_values(frame));
        }
    }
    return env_loop(env);
}
// functions from SICP JS 4.1.4
function is_primitive_function(fun) {
    return is_tagged_list(fun, "primitive");
}
function primitive_implementation(fun) { return (0, sicp_1.head)((0, sicp_1.tail)(fun)); }
var primitive_functions = (0, sicp_1.list)((0, sicp_1.list)("head", sicp_1.head), (0, sicp_1.list)("tail", sicp_1.tail), (0, sicp_1.list)("pair", sicp_1.pair), (0, sicp_1.list)("list", sicp_1.list), (0, sicp_1.list)("is_null", sicp_1.is_null), (0, sicp_1.list)("display", sicp_1.display), (0, sicp_1.list)("error", sicp_1.error), (0, sicp_1.list)("math_abs", sicp_1.math_abs), (0, sicp_1.list)("+", function (x, y) { return x + y; }), (0, sicp_1.list)("-", function (x, y) { return x - y; }), (0, sicp_1.list)("-unary", function (x) { return -x; }), (0, sicp_1.list)("*", function (x, y) { return x * y; }), (0, sicp_1.list)("/", function (x, y) { return x / y; }), (0, sicp_1.list)("%", function (x, y) { return x % y; }), (0, sicp_1.list)("===", function (x, y) { return x === y; }), (0, sicp_1.list)("!==", function (x, y) { return x !== y; }), (0, sicp_1.list)("<", function (x, y) { return x < y; }), (0, sicp_1.list)("<=", function (x, y) { return x <= y; }), (0, sicp_1.list)(">", function (x, y) { return x > y; }), (0, sicp_1.list)(">=", function (x, y) { return x >= y; }), (0, sicp_1.list)("!", function (x) { return !x; }));
var primitive_function_symbols = (0, sicp_1.map)(sicp_1.head, primitive_functions);
var primitive_function_objects = (0, sicp_1.map)(function (fun) { return (0, sicp_1.list)("primitive", (0, sicp_1.head)((0, sicp_1.tail)(fun))); }, primitive_functions);
var primitive_constants = (0, sicp_1.list)((0, sicp_1.list)("undefined", undefined), (0, sicp_1.list)("Infinity", Infinity), (0, sicp_1.list)("math_PI", sicp_1.math_PI), (0, sicp_1.list)("math_E", sicp_1.math_E), (0, sicp_1.list)("NaN", NaN));
var primitive_constant_symbols = (0, sicp_1.map)(function (c) { return (0, sicp_1.head)(c); }, primitive_constants);
var primitive_constant_values = (0, sicp_1.map)(function (c) { return (0, sicp_1.head)((0, sicp_1.tail)(c)); }, primitive_constants);
function apply_primitive_function(fun, arglist) {
    return (0, sicp_1.apply_in_underlying_javascript)(primitive_implementation(fun), arglist);
}
function setup_environment() {
    return extend_environment((0, sicp_1.append)(primitive_function_symbols, primitive_constant_symbols), (0, sicp_1.append)(primitive_function_objects, primitive_constant_values), the_empty_environment);
}
var the_global_environment = setup_environment();
function to_string(object) {
    return is_compound_function(object)
        ? "<compound-function>"
        : is_primitive_function(object)
            ? "<primitive-function>"
            : (0, sicp_1.is_pair)(object)
                ? "[" + to_string((0, sicp_1.head)(object)) + ", "
                    + to_string((0, sicp_1.tail)(object)) + "]"
                : (0, sicp_1.stringify)(object);
}
function user_print(prompt_string, object) {
    (0, sicp_1.display)("----------------------------", prompt_string + "\n" + to_string(object) + "\n");
}
function user_read(prompt_string) {
    (0, sicp_1.display)(prompt_string);
    return prompt("");
}
var input_prompt = "\nM-evaluate input:\n";
var output_prompt = "\nM-evaluate value:\n";
function driver_loop(env, history) {
    var input = user_read(history);
    if ((0, sicp_1.is_null)(input)) {
        (0, sicp_1.display)("", history + "\n--- session end ---\n");
    }
    else {
        var program = (0, sicp_1.parse)(input);
        console.log(program);
        var record_program = incremental_transform(program);
        var locals = scan_out_declarations(record_program);
        var unassigneds = list_of_unassigned(locals);
        var program_env = extend_environment(locals, unassigneds, env);
        var output = evaluate(record_program, program_env);
        var new_history = history +
            input_prompt +
            input +
            output_prompt +
            to_string(output);
        return driver_loop(program_env, new_history);
    }
}
"metacircular evaluator loaded";
driver_loop(the_global_environment, "--- session start ---");
