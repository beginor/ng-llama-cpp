import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    ChatPrompt, ChatMessage, createCompletionOptions, streamCompletion
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
    selector: 'app-chat',
    standalone: true,
    imports: [
        ChatMessageListComponent,
        ChatInputComponent
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent {

    public messages: ChatMessage[] = [];

    public answer = '';

    public state: UIState = 'idle';
    public input: ChatInput = { text: '' };

    private chatPrompt!: ChatPrompt;

    constructor(
        route: ActivatedRoute,
        private formatterService: FormatterService
    ) {
        route.params.subscribe(params => {
            const prompt = params['prompt'] as string;
            this.chatPrompt = {
                system: '',
                messages: [],
            };
            loadPrompt<ChatPrompt>(prompt).then(result => {
                this.chatPrompt.system = result.system;
                this.input.text = result.messages[0].content;
            }).catch(ex => {
                console.error(ex);
            });
            this.messages = [];
        });
    }

    public async onInputTextChange(text: string): Promise<void> {
        this.state = 'busy';
        this.chatPrompt.messages.push({ role: 'user', content: text });
        this.messages.push(
            { role: 'user', content: text, timestamp: Date.now() }
        );
        this.input.text = '';

        const formatter = this.formatterService.getFormatter();

        const prompt = formatter.formatChat(this.chatPrompt);
        const params = createCompletionOptions({
            stream: true,
            prompt: prompt,
            cache_prompt: true,
            n_predict: 2048,
            temperature: 0.5,
            stop: [...formatter.stopAt()]
        });

        const textStream = streamCompletion(params);

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

        this.chatPrompt.messages.push(message);
        this.messages.push(message);

        this.state = 'idle';
    }

}
