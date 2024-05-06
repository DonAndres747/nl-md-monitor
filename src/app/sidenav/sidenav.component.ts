import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { navbarData } from './navbar-data';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClientModel } from '../model/client.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnChanges, OnInit {
  @Input() collapsed: boolean = false;
  @Output() collapsedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  navData = navbarData;
  selectedTabs: any[] = [];

  constructor(private clientModel: ClientModel) {}

  ngOnInit(): void {
    this.navData.forEach((item, i) => {
      switch (item.id) {
        case 'WMS':
          item.available = this.clientModel.getWmsKey();
          break;
        case 'TEP':
          item.available = this.clientModel.getTepKey();
          break;
        case 'SAP':
          item.available = this.clientModel.getSapKey();
          break;

        default:
          break;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const collapsedChange = changes['collapsed'];
    if (!collapsedChange.currentValue) {
      this.navData.forEach((item, i) => {
        item.selected = false;
      });
    } else {
      //  console.log("Menu", this.menu());
    }
  }

  selectItem(index: number) {
    const selectedElement = this.navData.find((item) => item.selected === true);
    if (this.navData[index].selected || !selectedElement) {
      this.collapsed = !this.collapsed;
      this.collapsedChange.emit(this.collapsed);
    }
    this.navData.forEach((item, i) => {
      item.selected = i == index ? !item.selected : false;
    });
  }

  closeToggle() {
    this.collapsed = false;
    this.collapsedChange.emit(this.collapsed);
    this.navData.forEach((item, i) => {
      item.selected = false;
    });
  }

  menu() {
    return (
      this.collapsed && !this.navData.find((item) => item.selected === true)
    );
  }
}
