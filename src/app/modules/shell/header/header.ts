import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

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

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setFallbackLang('en');
  
    const savedLang = localStorage.getItem('selectedLanguage') as 'en' | 'pt' | 'es' | null;
    this.currentLang = savedLang || 'en';
  
    this.translate.use(this.currentLang);
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('selectedLanguage') as 'en' | 'pt' | 'es' | null;
  
    if (savedLang) {
      this.currentLang = savedLang;
  
      this.translate.use(savedLang).subscribe(() => {
        setTimeout(() => {
          this.applyStaticTranslations(savedLang);
          this.applyStaticPlaceholders(savedLang);
        }, 100);
      });
    }
  
    window.addEventListener('languageChanged', ((event: Event) => {
      const customEvent = event as CustomEvent<'en' | 'pt' | 'es'>;
      const lang = customEvent.detail;
  
      this.currentLang = lang;
  
      this.translate.use(lang).subscribe(() => {
        setTimeout(() => {
          this.applyStaticTranslations(lang);
          this.applyStaticPlaceholders(lang);
        }, 100);
      });
    }) as EventListener);

    this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'en' | 'pt' | 'es' | null;
    const lang = savedLang || this.currentLang;

    setTimeout(() => {
      this.translate.use(lang).subscribe(() => {
        this.applyStaticTranslations(lang);
        this.applyStaticPlaceholders(lang);
      });
    }, 250);
  });
  }

  changeLanguage(lang: 'en' | 'pt' | 'es') {
    localStorage.setItem('selectedLanguage', lang);
  
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