import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from '../sidenav/sidenav.component';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, SidenavComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  isSideNavigationCollapsed = false;
  screenWidth = 0;

  onToggleSideNav = (data: SideNavToggle) => {
    this.screenWidth = data.screenWidth;
    this.isSideNavigationCollapsed = data.collapsed;
  };
}
