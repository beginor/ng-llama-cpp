import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
    PromptFormatter, Llama2Formatter, Llama3Formatter, ChatMLFormater,
    MarkdownFormatter, getServerProps, ServerProps
} from 'llama-cpp';

@Injectable({
    providedIn: 'root'
})
export class FormatterService {

    private knownFormatters: Record<string,  PromptFormatter> = {
        llama2: new Llama2Formatter(),
        llama3: new Llama3Formatter(),
        chatml: new ChatMLFormater(),
        markdown: new MarkdownFormatter(),
    };

    private serverProps?: ServerProps;

    public isKnownModel = false;
    public formatter = 'chatml';

    constructor(private http: HttpClient) { }

    public getFormatter(): PromptFormatter {
        this.formatter = 'chatml';
        if (this.serverProps) {
            const model = this.serverProps.default_generation_settings.model;
            console.log(`Current model is: ${model}`);
            if (model.indexOf('phind-codellama') > -1) {
                this.formatter = 'markdown';
                this.isKnownModel = true;
            }
            else if (model.indexOf('codellama') > -1
                || model.indexOf('llama-2') > -1
                || model.indexOf('llama2') > -1
                || model.indexOf('mistral') > -1
            ) {
                this.formatter = 'llama2';
                this.isKnownModel = true;
            }
            else if (model.indexOf('llama-3') > -1
                || model.indexOf('llama3') > -1
            ) {
                this.formatter = 'llama3';
                this.isKnownModel = true;
            }
            else if (model.indexOf('qwen') > -1
                || model.indexOf('yi') > -1
            ) {
                this.formatter = 'chatml';
                this.isKnownModel = true;
            }
            else {
                this.isKnownModel = false;
            }
        }
        return this.knownFormatters[this.formatter];
    }

    public async getServerModel(): Promise<void> {
        this.serverProps = await getServerProps();
        this.getFormatter();
    }

}
