import { Component, HostListener } from '@angular/core';
import { RouterLinkWithHref, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;
  isPurposeVisible = false;
  isScrolled = false;
  lastScrollTop = 0;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    this.isScrolled = currentScroll > 50;

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

    const element = document.querySelector('.purpose-execution-hero');

    if (element) {
      const rect = element.getBoundingClientRect();

      this.isPurposeVisible = rect.top <= 200;
    } else {
      this.isPurposeVisible = false;
    }


  }


}