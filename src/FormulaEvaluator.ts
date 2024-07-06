import { Module } from "./ModuleRunner";
import { getBuffersFromList, changeValue } from "./util";
import { MaterialNames, Materials } from "./GameProperties";

export class FormulaReplacer implements Module {
  private tag = "pb-formulas";

  cleanup() {
    // Nothing to clean up.
    return;
  }

  run(allBuffers) {
    var buffers = getBuffersFromList("CXPO ", allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      addListeners(buffer, this.tag);
    });

    buffers = getBuffersFromList("FXPO ", allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      addListeners(buffer, this.tag);
    });

    buffers = getBuffersFromList("LMP ", allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      addListeners(buffer, this.tag);
    });

    buffers = getBuffersFromList("CONTD ", allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      addListeners(buffer, this.tag);
    });

    buffers = getBuffersFromList("MTRA ", allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      addListeners(buffer, this.tag);
    });
    return;
  }

}

function addListeners(buffer, tag) {
  const inputs = buffer.querySelectorAll("input");

  (Array.from(inputs) as HTMLInputElement[]).forEach(input => {
    if (input.classList.contains(tag)) {
      return;
    }
    input.classList.add(tag);
    input.addEventListener("keyup", function (e) {
      if (e.key != "Enter") {
        return;
      }	// Detect enter press

      if (input.value && input.value.charAt(0) == "=") {
        var expression = input.value.substring(1);
        // Preprocess expression
        // Replace MAT.t with tonnage
        var matches = expression.match(/\b[a-zA-Z0-9]{1,3}\.t\b/gi);
        if (matches) {
          matches.forEach(match => {
            const ticker = match.split(".")[0].toUpperCase();
            if (MaterialNames[ticker]) {
              expression = expression.replace(match, (Materials[MaterialNames[ticker][0]][1]).toLocaleString(undefined, { maximumFractionDigits: 3 }));
            }
          });
        }
        // Replace MAT.v, MAT.m, MAT.m3
        matches = expression.match(/\b([a-zA-Z0-9]{1,3})\.(?:v|m|m3)\b/gi);
        if (matches) {
          matches.forEach(match => {
            const ticker = match.split(".")[0].toUpperCase();
            if (MaterialNames[ticker]) {
              expression = expression.replace(match, (Materials[MaterialNames[ticker][0]][2]).toLocaleString(undefined, { maximumFractionDigits: 3 }));
            }
          });
        }
        // Replace MAT.max
        matches = expression.match(/\b([a-zA-Z0-9]{1,3})\.(?:max)\b/gi);
        if (matches) {
          matches.forEach(match => {
            const ticker = match.split(".")[0].toUpperCase();
            if (MaterialNames[ticker]) {
              expression = expression.replace(match, Math.max(Materials[MaterialNames[ticker][0]][1], Materials[MaterialNames[ticker][0]][2]).toLocaleString(undefined, { maximumFractionDigits: 3 }));
            }
          });
        }
        expression = expression.replace(/(?<![0-9])[.]/g, "0.");	// Replace .2 with 0.2
        var simplifiedExpression = evaluateMath(expression);

        simplifiedExpression = parseFloat(simplifiedExpression).toLocaleString(undefined, { useGrouping: false });

        changeValue(input, simplifiedExpression || "NaN");
      }
    });
  });
}

export function evaluateMath(expression, depth?: number) {
  // Keep track of how many evaluation steps have been taken to cap it.
  if (!depth) {
    depth = 0;
  }
  // Remove spaces
  expression = expression.replace(/\s/g, "");
  // Switch to using periods as decimal
  expression = expression.replace(/,/g, ".");

  // If any invalid characters exist, do not evaluate it.
  if (/[^0-9.,+\-\/*\^\(\)]/.test(expression)) {
    return null;
  }

  // Do parenthesis stuff here

  // Add missing open or closed parentesis
  const leftCount = (expression.match(/\(/g) || []).length;
  const rightCount = (expression.match(/\)/g) || []).length;
  if (leftCount > rightCount) {
    expression = expression + ")".repeat(leftCount - rightCount);
  } else if (rightCount > leftCount) {
    expression = "(".repeat(rightCount - leftCount) + expression;
  }

  var match = expression.match(/\(/);
  if (match) {
    var pCounter = 1;	// Count the number of parenthesis to close
    var substring = expression.substring(match.index + 1);
    const beginIndex = match.index;
    var offset = beginIndex + 1;
    var leftMatch;
    var rightMatch;
    do {
      //console.log(depth);
      leftMatch = substring.match(/\(/);
      rightMatch = substring.match(/\)/);
      //console.log(leftMatch);
      //console.log(rightMatch);
      if (leftMatch && (!rightMatch || leftMatch.index < rightMatch.index)) {
        pCounter++;
        substring = substring.substring(leftMatch.index + 1);
        offset += leftMatch.index + 1;
      } else if (rightMatch) {
        pCounter--;
        substring = substring.substring(rightMatch.index + 1);
        offset += rightMatch.index + 1;
      }
      //console.log("pCounter: " + pCounter);
      //console.log("Offset: " + offset)

      if (pCounter == 0)	// Found the outer set of parenthesis
      {
        const result = evaluateMath(expression.substring(beginIndex + 1, offset - 1), depth + 1);
        //console.log("Depth: " + depth);
        //console.log(expression);
        //console.log(beginIndex + " " + offset);
        //console.log(result);
        //console.log(expression.substring(beginIndex + 1, offset - 1))

        expression = expression.replace(expression.substring(beginIndex, offset), result);	// That 2 is bad I think
        //console.log(expression);
        expression = evaluateMath(expression, depth + 1);
        return expression;
      }
    } while (leftMatch || rightMatch);


  }

  // All parenthesis have been resolved

  // Evaluate exponents
  var match = expression.match(/(?:(?<!\d))(-?\d+(?:\.\d+)?)\^(-?\d+(?:\.\d+)?)/);
  if (match) {
    var left = parseFloat(match[1]);
    var right = parseFloat(match[2]);
    var result = Math.pow(left, right);
    expression = expression.replace(match[0], result.toString());
    expression = evaluateMath(expression, depth + 1);
    return expression;
  }

  // Evaluate multiplication/division
  const multMatch = expression.match(/(?:(?<!\d))(-?\d+(?:\.\d+)?)\*(-?\d+(?:\.\d+)?)/);
  const divMatch = expression.match(/(?:(?<!\d))(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/);
  if (multMatch && (!divMatch || divMatch.index > multMatch.index)) {
    var left = parseFloat(multMatch[1]);
    var right = parseFloat(multMatch[2]);
    var result = left * right;
    expression = expression.replace(multMatch[0], result.toString());
    expression = evaluateMath(expression, depth + 1);
    return expression;
  }

  // Evaluate division
  else if (divMatch) {
    var left = parseFloat(divMatch[1]);
    var right = parseFloat(divMatch[2]);
    var result = left / right;
    expression = expression.replace(divMatch[0], result.toString());
    expression = evaluateMath(expression, depth + 1);
    return expression;
  }

  // Evaluate addition/subtraction
  const addMatch = expression.match(/(?:(?<!\d))(-?\d+(?:\.\d+)?)\+(-?\d+(?:\.\d+)?)/);
  const subMatch = expression.match(/(?:(?<!\d))(-?\d+(?:\.\d+)?)\-(-?\d+(?:\.\d+)?)/);
  if (addMatch && (!subMatch || subMatch.index > addMatch.index)) {
    var left = parseFloat(addMatch[1]);
    var right = parseFloat(addMatch[2]);
    var result = left + right;
    expression = expression.replace(addMatch[0], result.toString());
    expression = evaluateMath(expression, depth + 1);
    return expression;
  }

  // Evaluate subtraction
  else if (subMatch) {
    var left = parseFloat(subMatch[1]);
    var right = parseFloat(subMatch[2]);
    var result = left - right;
    expression = expression.replace(subMatch[0], result.toString());
    expression = evaluateMath(expression, depth + 1);
    return expression;
  }

  // If any invalid characters exist, do not evaluate it.
  if (/[^\-0-9.]/.test(expression)) {
    return null;
  }

  return expression;
}
