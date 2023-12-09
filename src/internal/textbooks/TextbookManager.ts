import * as fs from "fs";

export default class TextbookManager {
  private bookContent: Map<string, string[]>;

  constructor(books: string[]) {
    this.bookContent = new Map();
    this.init(books);
  }

  private init(books: string[]) {
    let curChapter = 1;
    for (let i = 0; i < books.length; i++) {
      const cur = books[i];
      const allFileContents = fs.readFileSync("./public/" + cur, "utf-8");
      let chaptersContent: string[] = [];

      allFileContents.split(/\r?\n/).forEach((line) => {
        const regex = new RegExp("CHAPTER_(" + String.raw`\d+` + ")_CHAPTER");
        if (regex !== null) {
          if (!regex.test(line)) {
            chaptersContent[curChapter] += line;
          } else {
            const match = line.match(regex);
            if (match !== null) {
              curChapter = Number.parseInt(match[1]);
            }
          }
        }
      });

      this.bookContent.set(cur, chaptersContent);
    }
  }

  public getBookData(book: string): string[] | undefined {
    return this.bookContent.get(book);
  }

  public getBookChapterData(book: string, chapter: number): string | undefined {
    const data = this.getBookData(book);
    return data === undefined ? undefined : data[chapter];
  }

  public getTextBookChapters(textBook: string): number {
    const textbookContent = this.getBookData(textBook);
    return textbookContent === undefined ? 0 : textbookContent.length;
  }
}
