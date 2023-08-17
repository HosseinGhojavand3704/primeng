import { Component, Input } from '@angular/core';
import { Code } from '../../domain/code';

@Component({
    selector: 'file-upload-import-doc',
    template: ` <section>
        <app-docsectiontext [title]="title" [id]="id"></app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    </section>`
})
export class ImportDoc {
    @Input() id: string;

    @Input() title: string;

    code: Code = {
        typescript: `import { FileUploadModule } from 'avan-primeng/fileupload';`
    };
}
