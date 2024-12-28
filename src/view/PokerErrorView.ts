export default class PokerErrorView {
    constructor(private data: string) {}
    static load(message: string = '') {
        return new PokerErrorView(`    
        ░        ░░       ░░░       ░░░░      ░░░       ░░
        ▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒
        ▓      ▓▓▓▓       ▓▓▓       ▓▓▓  ▓▓▓▓  ▓▓       ▓▓
        █  ████████  ███  ███  ███  ███  ████  ██  ███  ██
        █        ██  ████  ██  ████  ███      ███  ████  █   
     	(⌐■_■) ${message == '' ? message: ' - ' + message}
        `);
    }
    toString() {
        return this.data;
    }
}