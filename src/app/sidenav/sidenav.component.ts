import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { navbarData } from './navbar-data';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  @Input() collapsed = false;
  @Output() onToggleSideNav: EventEmitter<string> = new EventEmitter();
  navData = navbarData;
  selectedTabs: any[] = [];

  selectItem(index: number) {
    const selectedElement = this.navData.find((item) => item.selected === true);

    if (this.navData[index].selected || !selectedElement) {
      this.toggleCollapse();
    }

    this.navData.forEach((item, i) => {
      item.selected = i == index ? !item.selected : false;
    });
  }

  toggleCollapse = () => {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit();
  };

  vh() {
    console.log(this.selectedTabs);
  }
}
