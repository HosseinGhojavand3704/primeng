import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, QueryList, ElementRef, ChangeDetectorRef, TemplateRef, ViewChild, Output, EventEmitter, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DomHandler } from 'avan-primeng/dom';
import { PrimeTemplate, SharedModule } from 'avan-primeng/api';
import { SplitterResizeStartEvent, SplitterResizeEndEvent } from './splitter.interface';

@Component({
    selector: 'p-splitter',
    template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-template ngFor let-panel let-i="index" [ngForOf]="panels">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div class="p-splitter-gutter" *ngIf="i !== panels.length - 1" [ngStyle]="gutterStyle()" (mousedown)="onGutterMouseDown($event, i)" (touchstart)="onGutterTouchStart($event, i)">
                    <div class="p-splitter-gutter-handle"></div>
                </div>
            </ng-template>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./splitter.css'],
    host: {
        class: 'p-element',
        '[class.p-splitter-panel-nested]': 'nested'
    }
})
export class Splitter {
    /**
     * Style class of the component.
     */
    @Input() styleClass: string;
    /**
     * Style class of the panel.
     */
    @Input() panelStyleClass: string;
    /**
     * Inline style of the component.
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Inline style of the panel.
     */
    @Input() panelStyle: { [klass: string]: any } | null | undefined;
    /**
     * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
     */
    @Input() stateStorage: 'local' | 'session' | undefined = 'session';
    /**
     * Storage identifier of a stateful Splitter.
     */
    @Input() stateKey: string | undefined | null = null;
    /**
     * Orientation of the panels.
     */
    @Input() layout: 'horizontal' | 'vertical' | undefined = 'horizontal';
    /**
     * Size of the divider in pixels.
     */
    @Input() gutterSize: number = 4;
    /**
     * Minimum size of the elements relative to 100%.
     */
    @Input() minSizes: number[] = [];
    /**
     * Size of the elements relative to 100%.
     */
    @Input() get panelSizes(): number[] {
        return this._panelSizes;
    }
    set panelSizes(val: number[]) {
        this._panelSizes = val;

        if (this.el && this.el.nativeElement && this.panels.length > 0) {
            let children = [...this.el.nativeElement.children[0].children].filter((child) => DomHandler.hasClass(child, 'p-splitter-panel'));
            let _panelSizes = [];

            this.panels.map((panel, i) => {
                let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
                let panelSize = panelInitialSize || 100 / this.panels.length;
                _panelSizes[i] = panelSize;
                children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            });
        }
    }
    /**
     * Callback to invoke when resize ends.
     * @param {SplitterResizeEndEvent} event - Custom panel resize end event
     * @group Emits
     */
    @Output() onResizeEnd: EventEmitter<SplitterResizeEndEvent> = new EventEmitter<SplitterResizeEndEvent>();
    /**
     * Callback to invoke when resize starts.
     * @param {SplitterResizeStartEvent} event - Custom panel resize start event
     * @group Emits
     */
    @Output() onResizeStart: EventEmitter<SplitterResizeStartEvent> = new EventEmitter<SplitterResizeStartEvent>();

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

    @ViewChild('container', { static: false }) containerViewChild: ElementRef;

    nested: boolean = false;

    panels: any[] = [];

    dragging: boolean = false;

    mouseMoveListener: VoidFunction | null;

    mouseUpListener: VoidFunction | null;

    touchMoveListener: VoidFunction | null;

    touchEndListener: VoidFunction | null;

    size: number = null;

    gutterElement: any = null;

    startPos: number = null;

    prevPanelElement: any = null;

    nextPanelElement: any = null;

    nextPanelSize: number = null;

    prevPanelSize: number = null;

    _panelSizes: number[] = [];

    prevPanelIndex: number = null;

    private window: Window;

    constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: any, private renderer: Renderer2, public cd: ChangeDetectorRef, private el: ElementRef) {
        this.window = this.document.defaultView as Window;
    }

    ngOnInit() {
        this.nested = this.isNested();
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'panel':
                    this.panels.push(item.template);
                    break;
                default:
                    this.panels.push(item.template);
                    break;
            }
        });
    }

    ngAfterViewInit() {
        if (this.panels && this.panels.length) {
            let initialized = false;
            if (this.isStateful() && isPlatformBrowser(this.platformId)) {
                initialized = this.restoreState();
            }

            if (!initialized) {
                let children = [...this.el.nativeElement.children[0].children].filter((child) => DomHandler.hasClass(child, 'p-splitter-panel'));
                let _panelSizes = [];

                this.panels.map((panel, i) => {
                    let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
                    let panelSize = panelInitialSize || 100 / this.panels.length;
                    _panelSizes[i] = panelSize;
                    children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
                });

                this._panelSizes = _panelSizes;
            }
        }
    }

    resizeStart(event: TouchEvent | MouseEvent, index: number) {
        this.gutterElement = event.currentTarget as HTMLElement;
        this.size = this.horizontal() ? DomHandler.getWidth(this.containerViewChild.nativeElement) : DomHandler.getHeight(this.containerViewChild.nativeElement);
        this.dragging = true;
        this.startPos = this.horizontal() ? (event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX) : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
        this.prevPanelElement = this.gutterElement.previousElementSibling as HTMLElement;
        this.nextPanelElement = this.gutterElement.nextElementSibling as HTMLElement;
        this.prevPanelSize = (100 * (this.horizontal() ? DomHandler.getOuterWidth(this.prevPanelElement, true) : DomHandler.getOuterHeight(this.prevPanelElement, true))) / this.size;
        this.nextPanelSize = (100 * (this.horizontal() ? DomHandler.getOuterWidth(this.nextPanelElement, true) : DomHandler.getOuterHeight(this.nextPanelElement, true))) / this.size;
        this.prevPanelIndex = index;
        DomHandler.addClass(this.gutterElement, 'p-splitter-gutter-resizing');
        DomHandler.addClass(this.containerViewChild.nativeElement, 'p-splitter-resizing');
        this.onResizeStart.emit({ originalEvent: event, sizes: this._panelSizes });
    }

    onResize(event: MouseEvent) {
        let newPos;
        if (this.horizontal()) newPos = (event.pageX * 100) / this.size - (this.startPos * 100) / this.size;
        else newPos = (event.pageY * 100) / this.size - (this.startPos * 100) / this.size;

        let newPrevPanelSize = this.prevPanelSize + newPos;
        let newNextPanelSize = this.nextPanelSize - newPos;

        if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
            this.prevPanelElement.style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            this.nextPanelElement.style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            this._panelSizes[this.prevPanelIndex] = newPrevPanelSize;
            this._panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
        }
    }

    resizeEnd(event: MouseEvent | TouchEvent) {
        if (this.isStateful()) {
            this.saveState();
        }

        this.onResizeEnd.emit({ originalEvent: event, sizes: this._panelSizes });
        DomHandler.removeClass(this.gutterElement, 'p-splitter-gutter-resizing');
        DomHandler.removeClass(this.containerViewChild.nativeElement, 'p-splitter-resizing');
        this.clear();
    }

    onGutterMouseDown(event: MouseEvent, index: number) {
        this.resizeStart(event, index);
        this.bindMouseListeners();
    }

    onGutterTouchStart(event: TouchEvent, index: number) {
        if (event.cancelable) {
            this.resizeStart(event, index);
            this.bindTouchListeners();

            event.preventDefault();
        }
    }

    onGutterTouchEnd(event: TouchEvent) {
        this.resizeEnd(event);
        this.unbindTouchListeners();

        if (event.cancelable) event.preventDefault();
    }

    validateResize(newPrevPanelSize: number, newNextPanelSize: number) {
        if (this.minSizes.length >= 1 && this.minSizes[0] && this.minSizes[0] > newPrevPanelSize) {
            return false;
        }

        if (this.minSizes.length > 1 && this.minSizes[1] && this.minSizes[1] > newNextPanelSize) {
            return false;
        }

        return true;
    }

    bindMouseListeners() {
        if (!this.mouseMoveListener) {
            this.mouseMoveListener = this.renderer.listen(this.document, 'mousemove', (event) => {
                this.onResize(event);
            });
        }

        if (!this.mouseUpListener) {
            this.mouseUpListener = this.renderer.listen(this.document, 'mouseup', (event) => {
                this.resizeEnd(event);
                this.unbindMouseListeners();
            });
        }
    }

    bindTouchListeners() {
        if (!this.touchMoveListener) {
            this.touchMoveListener = this.renderer.listen(this.document, 'touchmove', (event) => {
                this.onResize(event.changedTouches[0]);
            });
        }

        if (!this.touchEndListener) {
            this.touchEndListener = this.renderer.listen(this.document, 'touchend', (event) => {
                this.resizeEnd(event);
                this.unbindTouchListeners();
            });
        }
    }

    unbindMouseListeners() {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
            this.mouseMoveListener = null;
        }

        if (this.mouseUpListener) {
            this.mouseUpListener();
            this.mouseUpListener = null;
        }
    }

    unbindTouchListeners() {
        if (this.touchMoveListener) {
            this.touchMoveListener();
            this.touchMoveListener = null;
        }

        if (this.touchEndListener) {
            this.touchEndListener();
            this.touchEndListener = null;
        }
    }

    clear() {
        this.dragging = false;
        this.size = null;
        this.startPos = null;
        this.prevPanelElement = null;
        this.nextPanelElement = null;
        this.prevPanelSize = null;
        this.nextPanelSize = null;
        this.gutterElement = null;
        this.prevPanelIndex = null;
    }

    isNested() {
        if (this.el.nativeElement) {
            let parent = this.el.nativeElement.parentElement;
            while (parent && !DomHandler.hasClass(parent, 'p-splitter')) {
                parent = parent.parentElement;
            }

            return parent !== null;
        } else {
            return false;
        }
    }

    isStateful() {
        return this.stateKey != null;
    }

    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage) {
                case 'local':
                    return this.window.localStorage;

                case 'session':
                    return this.window.sessionStorage;

                default:
                    throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        } else {
            throw new Error('Storage is not a available by default on the server.');
        }
    }

    saveState() {
        this.getStorage().setItem(this.stateKey, JSON.stringify(this._panelSizes));
    }

    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);

        if (stateString) {
            this._panelSizes = JSON.parse(stateString);
            let children = [...this.containerViewChild.nativeElement.children].filter((child) => DomHandler.hasClass(child, 'p-splitter-panel'));
            children.forEach((child, i) => {
                child.style.flexBasis = 'calc(' + this._panelSizes[i] + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            });

            return true;
        }

        return false;
    }

    containerClass() {
        return {
            'p-splitter p-component': true,
            'p-splitter-horizontal': this.layout === 'horizontal',
            'p-splitter-vertical': this.layout === 'vertical'
        };
    }

    panelContainerClass() {
        return {
            'p-splitter-panel': true,
            'p-splitter-panel-nested': true
        };
    }

    gutterStyle() {
        if (this.horizontal()) return { width: this.gutterSize + 'px' };
        else return { height: this.gutterSize + 'px' };
    }

    horizontal() {
        return this.layout === 'horizontal';
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Splitter, SharedModule],
    declarations: [Splitter]
})
export class SplitterModule {}
