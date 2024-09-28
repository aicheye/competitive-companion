import { Sendable } from '../../models/Sendable';
import { TaskBuilder } from '../../models/TaskBuilder';
import { htmlToElement } from '../../utils/dom';
import { Parser } from '../Parser';

export class HydroProblemParser extends Parser {
  protected domain = 'hydro.ac';
  protected judge = 'Hydro';

  public getMatchPatterns(): string[] {
    return [`https://${this.domain}/p/*`, `https://${this.domain}/d/*/p/*`, `https://${this.domain}/contest/*/p/*`];
  }

  public async parse(url: string, html: string): Promise<Sendable> {
    const elem = htmlToElement(html);
    const task = new TaskBuilder(this.judge).setUrl(url);

    task.setName(elem.querySelector('.section__title').lastChild.textContent.trim());

    const blocks = [...elem.querySelectorAll('.sample > pre > code')];
    for (let i = 0; i < blocks.length - 1; i += 2) {
      task.addTest(blocks[i].textContent, blocks[i + 1].textContent);
    }

    const timeLimitStr = elem.querySelector('.icon-stopwatch').textContent;
    task.setTimeLimit(parseInt(/(\d+)ms/.exec(timeLimitStr)[1], 10));

    const memoryLimitStr = elem.querySelector('.icon-comparison').textContent;
    task.setMemoryLimit(parseInt(/(\d+)MiB/.exec(memoryLimitStr)[1], 10));

    return task.build();
  }
}
