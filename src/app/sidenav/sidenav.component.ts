import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { navbarData } from './navbar-data';
import { MatIcon } from '@angular/material/icon';

// interface SideNavToggle {
//   screenWidth: number;
//   collapsed: boolean;
// }

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  @Input() collapsed =  false;
  @Output() onToggleSideNav: EventEmitter<string> = new EventEmitter(); 
  navData = navbarData; 

  toggleCollapse = () => {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit();
  };
 
}
