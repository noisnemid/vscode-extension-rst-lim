# rst-lim README

rst-lim = reStructuredText-Less-is-More!

rST(reStructuredText exension designed following the thought of Less is More!

Clean, clear, and light-weight supports for resStructuredText language, Not any active/intrusive modifications to the texts -- these should be left to the writers themselves.

## Features

1.  Very fundamental reStructuredText language definition to activate the snippets working.
2.  Outline support.
3.  Code-block directive higlight support.
4.  Inline auto-close pairs support.

## Some Common Features TODO

1.  Revers-location to Outline Items when clicking a Title.

## Tips

It's recommended to use Fabio Spampinato's VsCode-Highlight Extension to make explicit highlight plans, which means you could directly control and override any other highlight styles such as giving the control rights to a indirect color-theme rendering.

Here are some examples for rST:

```
    "highlight.regexes": {
    "([\\t ]+$)": {
        "memo": "wrong ending spaces",
        "filterFileRegex": ".*\\.rst$",
        "decorations": [
            {
                "backgroundColor": "yellow",
                "border": "1px solid red",
                "borderRadius": "4px"
            }
        ]
    }
},
"highlight.regexFlags": "gm", // Default flags used when building the regexes
"highlight.maxMatches": 2500,
```

## Requirements

Nothing.

## Extension Settings

At now, zero settings!

I want to keep it like air!

You'll just gradually make some snippets and highlight rules for yourself after days of writing.

And during that, you just need to concentrate on your writing.

## Known Issues

...

## Release Notes

1.0.4 Update the VsCode Engine Version and Dependencies' versions, and Publish to Extension Market

1.0.3 auto-close pairs *

1.0.2 headline fix

1.0. basic implementation


# Modification Guidance

Files involved to edit or change:

in the extension prject folder:

```
package.json
tsconfig.json: compilerOptions:strict:false

syntaxes/*

src/extension.ts
src/features/rstDocumentSymbolProvider.ts

res/*

```

# Thanks To

Trond Snekvik's "reStructuredText Syntax highlighting" Extension which inspired me.

# Notes for other VsCode distros Users

.vsix is shipped with the sources codes on github, if you are using this in ohter vscode distros (say Code-OSS or Codium), you could download the vsix and install it directly.

**Enjoy!**
