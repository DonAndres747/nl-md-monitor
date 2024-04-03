import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { navbarData } from './navbar-data';
import { MatIcon } from '@angular/material/icon';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  navData = navbarData;
  collapsed = false;
  screenWidth = 0;

  toggleCollapse = () => {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  };

  closeSidenav = () => {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  };
}
