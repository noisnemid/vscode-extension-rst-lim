"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.rstDocumentSymbolProvider = void 0;
const vscode = __importStar(require("vscode"));
// import { rejects } from "assert";
// import { InsertTextFormat } from 'vscode-languageclient';
// import { NONAME } from "dns";
console.log('loaded rst symbol provider!!!');
class rstDocumentSymbolProvider {
    titleEval(document, i) {
        const titleRx = /^(=|-|~|`|#|"|\^|\+|\*|:|\.|'|_|\+)\1{3,}$/;
        const blankRx = /^\s*$/;
        let l1 = document.lineAt(i);
        let l2 = document.lineAt(i + 1);
        let info = {
            isTitle: false,
            jump: 1,
            line: null,
            mark: "",
        };
        if (!blankRx.test(l1.text) &&
            !titleRx.test(l1.text) &&
            titleRx.test(l2.text)) {
            info = {
                isTitle: true,
                jump: 2,
                line: l1,
                mark: l2.text.slice(0, 1) + "U", // underline styled title
            };
        }
        else if (i < document.lineCount - 2 &&
            titleRx.test(l1.text) &&
            !blankRx.test(l2.text) &&
            !titleRx.test(l2.text) &&
            titleRx.test(document.lineAt(i + 2).text)) {
            info = {
                isTitle: true,
                jump: 3,
                line: l2,
                mark: l1.text.slice(0, 1) + "OU", // overline+underline styled title
            };
        }
        return info;
    }
    provideDocumentSymbols(document, token) {
        return new Promise((resolve) => {
            // ---- 第一遍：收集所有标题及其层级 ----
            const titles = [];
            const markRegistry = [];
            let i = 0;
            while (i < document.lineCount - 1) {
                const info = this.titleEval(document, i);
                if (info.isTitle) {
                    let level = markRegistry.indexOf(info.mark);
                    if (level === -1) {
                        markRegistry.push(info.mark);
                        level = markRegistry.indexOf(info.mark);
                    }
                    titles.push({
                        line: info.line.lineNumber,
                        level,
                        mark: info.mark,
                        text: info.line.text,
                    });
                }
                i += info.jump;
            }
            // ---- 第二遍：算出每个标题的章节范围，再组装嵌套 ----
            const symbols = [];
            const stack = [];
            for (let t = 0; t < titles.length; t++) {
                const cur = titles[t];
                // 章节结束行：同级或更浅（更高级）标题的所在行；若无则到文档末尾
                let endLine = document.lineCount;
                for (let k = t + 1; k < titles.length; k++) {
                    if (titles[k].level <= cur.level) {
                        endLine = titles[k].line;
                        break;
                    }
                }
                const titleLine = document.lineAt(cur.line);
                const smb = new vscode.DocumentSymbol(cur.text, "H" + (cur.level + 1), vscode.SymbolKind.Field, // determines the outline-item icon
                new vscode.Range(cur.line, 0, endLine, 0), // range = 整个章节（反向定位依赖它）
                titleLine.range // selectionRange = 标题行（正向跳转依赖它）
                );
                // 弹出比当前标题更深的栈顶，挂到最近的更浅/同级标题之下
                while (stack.length && stack[stack.length - 1].level >= cur.level) {
                    stack.pop();
                }
                if (stack.length) {
                    stack[stack.length - 1].children.push(smb);
                }
                else {
                    symbols.push(smb);
                }
                stack.push({ level: cur.level, children: smb.children });
            }
            console.log("[rst-lim] provider called:", document.languageId, document.fileName, "symbols=" + symbols.length, "titles=" + titles.length);
            resolve(symbols);
        });
    }
}
exports.rstDocumentSymbolProvider = rstDocumentSymbolProvider;
//# sourceMappingURL=rstDocumentSymbolProvider.js.map