import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;
  isPurposeVisible = false;
  isScrolled = false;
  lastScrollTop = 0;

  currentLang: 'en' | 'pt' | 'es' = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setFallbackLang('en');
    this.translate.use(this.currentLang);
  }

  changeLanguage(lang: 'en' | 'pt' | 'es') {
    this.currentLang = lang;
    this.translate.use(lang).subscribe(() => {
      this.applyStaticTranslations(lang);
      this.applyStaticPlaceholders(lang);
    });
    this.closeMenu();
  }

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

  private originalTexts = new Map<Element, string>();

private applyStaticTranslations(lang: 'en' | 'es' | 'pt') {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (!this.originalTexts.has(el)) {
      this.originalTexts.set(el, el.textContent?.trim() || '');
    }

    if (lang === 'en') {
      el.textContent = this.originalTexts.get(el) || '';
      return;
    }

    const key = el.getAttribute('data-i18n');
    if (!key) return;

    this.translate.get(key).subscribe((translated) => {
      el.textContent = translated;
    });
  });
}
private originalPlaceholders = new Map<Element, string>();

private applyStaticPlaceholders(lang: 'en' | 'es' | 'pt') {
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el: any) => {
    if (!this.originalPlaceholders.has(el)) {
      this.originalPlaceholders.set(el, el.getAttribute('placeholder') || '');
    }

    if (lang === 'en') {
      el.setAttribute('placeholder', this.originalPlaceholders.get(el) || '');
      return;
    }

    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;

    this.translate.get(key).subscribe((translated) => {
      el.setAttribute('placeholder', translated);
    });
  });
}
}