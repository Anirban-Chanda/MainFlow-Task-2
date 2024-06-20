function infixToPostfix(infix) {
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3,
        'sin': 4,
        'cos': 4,
        'tan': 4,
        'log': 4,
        '!': 5
    };

    const isOperator = (ch) => ['+', '-', '*', '/', '^', '!'].includes(ch);
    const isFunction = (fn) => ['sin', 'cos', 'tan', 'log'].includes(fn);
    const isOperand = (ch) => /\d/.test(ch) || ch === '.';
    const isLeftParenthesis = (ch) => ch === '(';
    const isRightParenthesis = (ch) => ch === ')';

    const outputQueue = [];
    const operatorStack = [];

    let i = 0;
    while (i < infix.length) {
        let ch = infix[i];

        if (isOperand(ch)) {
            let num = '';
            while (i < infix.length && (isOperand(infix[i]) || infix[i] === '.')) {
                num += infix[i++];
            }
            outputQueue.push(num);
            continue;
        }

        if (isFunction(infix.slice(i, i + 3))) {
            let func = infix.slice(i, i + 3);
            operatorStack.push(func);
            i += 3;
            continue;
        }

        if (isOperator(ch)) {
            while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[ch]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(ch);
        } else if (isLeftParenthesis(ch)) {
            if (i > 0 && (isOperand(infix[i - 1]) || infix[i - 1] === ')')) {
                operatorStack.push('*');  // Handle implicit multiplication
            }
            operatorStack.push(ch);
        } else if (isRightParenthesis(ch)) {
            while (operatorStack.length && !isLeftParenthesis(operatorStack[operatorStack.length - 1])) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // Pop the '('
            if (operatorStack.length && isFunction(operatorStack[operatorStack.length - 1])) {
                outputQueue.push(operatorStack.pop());
            }
        } else if (ch === ' ') {
            // Ignore spaces
        } else {
            // Handle implicit multiplication for cases like "2(3+4)" or "(2+3)4"
            if (i > 0 && (isOperand(infix[i - 1]) || infix[i - 1] === ')')) {
                operatorStack.push('*');
            }
        }
        i++;
    }

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue.join(' ');
}

function factorial(n) {
    if (n < 0) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function evaluatePostfix(postfix) {
    const stack = [];

    for (let ch of postfix.split(' ')) {
        if (!isNaN(ch)) {
            stack.push(Number(ch));
        } else if (['+', '-', '*', '/', '^'].includes(ch)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (ch) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
            }
        } else if (['sin', 'cos', 'tan', 'log'].includes(ch)) {
            const a = stack.pop();
            switch (ch) {
                case 'sin':
                    stack.push(Math.sin(a));
                    break;
                case 'cos':
                    stack.push(Math.cos(a));
                    break;
                case 'tan':
                    stack.push(Math.tan(a));
                    break;
                case 'log':
                    stack.push(Math.log(a));
                    break;
            }
        } else if (ch === '!') {
            const a = stack.pop();
            stack.push(factorial(a));
        }
    }

    return stack.pop();
}

function evaluateInfix(infix) {
    const postfix = infixToPostfix(infix.replace(/\s+/g, ''));
    return evaluatePostfix(postfix);
}

function answer() {
    expression = document.getElementById('calc-input').value;
    result = evaluateInfix(expression);
    if (!isNaN(result)) {
        document.getElementById('calc-answer').innerHTML = result;
    }
}

document.getElementById('calc-input').value = 0;
answer();


document.getElementById('calc-buttons').querySelectorAll('button').forEach((element) => {
    element.addEventListener('click', () => {
        origString = document.getElementById('calc-input').value
        inputElement = document.getElementById('calc-input')
        if (element.innerHTML == 'clear') {
            inputElement.value = origString.slice(0, -1)
            if (inputElement.value == '')
                inputElement.value = 0;
        }
        else if (element.innerHTML == 'AC')
            inputElement.value = 0;
        else {
            if (origString == '0')
                origString = ''
            inputElement.value = origString + element.innerHTML;
        }
        answer()
    });
});
