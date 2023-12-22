import chalk from "chalk";
import * as fs from "fs";

export default class TextbookManager {
  private bookContent: Map<string, string[]>;

  constructor(private books: string[]) {
    this.bookContent = new Map();
    this.init();
    console.log(chalk.blue("Done init TextbookManager!"));
  }

  public getTextBooks() {}

  private init() {
    let curChapter = 0;
    for (let i = 0; i < this.books.length; i++) {
      const cur = this.books[i];
      const allFileContents = fs.readFileSync(
        "./public/" + cur + ".txt",
        "utf-8"
      );
      let chaptersContent: string[] = [];
      //console.log(allFileContents.length + "!!!!!");

      allFileContents.split(/\r?\n/).forEach((line) => {
        const regex = new RegExp("CHAPTER_(" + String.raw`\d+` + ")_CHAPTER");
        if (regex !== null) {
          if (!regex.test(line)) {
            chaptersContent[curChapter] ??= "";
            chaptersContent[curChapter] += line;
          } else {
            const match = line.match(regex);
            if (match !== null) {
              curChapter = Number.parseInt(match[1]);
            }
          }
        }
      });

      this.bookContent.set(cur.replace(".txt", ""), chaptersContent);
    }
  }

  public getBookData(book: string): string[] | undefined {
    //console.log(this.bookContent);
    return this.bookContent.get(book);
  }

  public getBookChapterData(book: string, chapter: number): string | undefined {
    const data = this.getBookData(book);
    return data?.[chapter];
  }

  public getTextBookChapters(textBook: string): number {
    const textbookContent = this.getBookData(textBook);
    return textbookContent === undefined ? 0 : textbookContent.length;
  }

  public getBookList(): string[] {
    return this.books;
  }
}
