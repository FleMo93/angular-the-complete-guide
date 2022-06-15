import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  constructor(private readonly elementRef: ElementRef<Node>) { }

  @HostListener('document:click', ['$event'])
  onClickDocument(event: Event) {
    if (this.isOpen &&
      event.target instanceof Node &&
      !this.elementRef.nativeElement.contains(event.target))
      this.isOpen = !this.isOpen;
  }

  @HostListener('click')
  onClick() {
    this.isOpen = !this.isOpen;
  }
}
