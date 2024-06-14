import { PromptFormatter } from './prompts';
import { ChatMLFormater } from './formatters/chatml';
import { Llama2Formatter } from './formatters/llama2';
import { Llama3Formatter } from './formatters/llama3';
import { MarkdownFormatter } from './formatters/markdown';

export const formatters: Record<string, PromptFormatter> = {
    chatml: new ChatMLFormater(),
    llama2: new Llama2Formatter(),
    llama3: new Llama3Formatter(),
    markdown: new MarkdownFormatter()
};
