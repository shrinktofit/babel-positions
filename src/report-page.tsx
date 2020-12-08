import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDiffViewer from 'react-diff-viewer';

export class ReportPage {
    constructor(samples: string[], generations: string[]) {
        this._samples = samples;
        this._generations = generations;
    }

    public add(generationName: string, sampleName: string, code: string) {
        const generations = this._table[sampleName] ??= {};
        generations[generationName] = code;
    }

    public render() {
        const table =
        <html>
            <body>
                {
                    this._samples.map((sampleName) => {
                        <ReactDiffViewer
                            oldValue={this._table[sampleName][this._generations[0]]}
                            newValue={this._table[sampleName][this._generations[1]]}
                            splitView={true}
                            // renderContent={this.highlightSyntax}
                        />
                    })
                }
            <table>
                <tr>
                    <td></td>
                    {
                        this._generations.map((generationName) => <td> {generationName} </td>)
                    }
                </tr>
                {
                    this._samples.map((sampleName) => {
                        return <tr>
                            <td>{ sampleName }</td>
                            {
                                this._generations.map((generationName) => {
                                    const code = this._table[sampleName]?.[generationName];
                                    if (code) {
                                        return <td><pre> {code} </pre></td>;
                                    }
                                })
                            }
                        </tr>
                    })
                }
            </table>
        </body></html>;
        return ReactDOMServer.renderToString(table);
    }

    private _generations: string[] = [];
    private _samples: string[] = [];
    private _table: Record<string, Record<string, string>> = {};
}
