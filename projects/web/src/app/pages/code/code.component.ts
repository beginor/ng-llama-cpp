import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    InstructPrompt, ChatMessage, createCompletionOptions, streamCompletion,
} from 'llama-cpp';

import {
    ChatMessageListComponent
} from '../../components/chat-message-list/chat-message-list.component';
import {
    ChatInputComponent, ChatInput
} from '../../components/chat-input/chat-input.component';
import { UIState } from '../../components/ui-state';
import { loadPrompt } from '../../components/prompt-util';
import { FormatterService } from '../../services/formatter.service';

@Component({
    selector: 'app-code',
    standalone: true,
    imports: [
        ChatMessageListComponent,
        ChatInputComponent
    ],
    templateUrl: './code.component.html',
    styleUrl: './code.component.css'
})
export class CodeComponent {

    public messages: ChatMessage[] = [];

    public answer = '';

    public state: UIState = 'idle';
    public input: ChatInput = { text: '' };

    private instPrompt!: InstructPrompt;

    constructor(
        route: ActivatedRoute,
        private formatterService: FormatterService
    ) {
        route.params.subscribe(params => {
            const prompt = params['prompt'] as string;
            this.instPrompt = {
                system: '',
                instruction: '',
                responsePrefix: '',
                stops: [],
            };
            loadPrompt<InstructPrompt>(prompt).then(result => {
                Object.assign(this.instPrompt, result);
                this.input.text = result.instruction;
            }).catch(ex => {
                console.error(ex);
            });
            this.messages = [];
        });
    }

    public async onInputTextChange(text: string): Promise<void> {
        this.state = 'busy';
        this.instPrompt.instruction = text;
        this.messages.push(
            { role: 'user', content: text, timestamp: Date.now() }
        );
        this.input.text = '';

        const formatter = this.formatterService.getFormatter();
        const prompt = formatter.formatInstruct(this.instPrompt);
        const options = createCompletionOptions({
            stream: true,
            prompt: prompt,
            cache_prompt: true,
            n_predict: 2048,
            temperature: 0.5,
            stop: [...this.instPrompt.stops, ...formatter.stopAt()]
        });

        const textStream = streamCompletion(options);

        for await (const textPart of textStream) {
            this.answer += textPart;
        }
        const fullAnswer = this.answer;
        this.answer = '';

        const message: ChatMessage = {
            role: 'assistant',
            content: fullAnswer,
            timestamp: Date.now()
        };

        this.messages.push(message);

        this.state = 'idle';
    }

}
