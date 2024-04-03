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
  // @Input() collapsed = false;
  collapsed = false;
  navData = navbarData;
  selectedTabs: any[] = [];

  selectItem(index: number) {
    const selectedElement = this.navData.find((item) => item.selected === true);

    if (this.navData[index].selected || !selectedElement) {
      this.collapsed = !this.collapsed;
    }

    this.navData.forEach((item, i) => {
      item.selected = i == index ? !item.selected : false;
    });
  }

  closeToggle() {
    this.collapsed = false;
    this.navData.forEach((item, i) => {
      item.selected = false;
    });
  }
}
