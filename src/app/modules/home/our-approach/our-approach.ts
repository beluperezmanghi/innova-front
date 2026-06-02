import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import * as AOS from 'aos';
import { Footer } from '../../shell/footer/footer';

@Component({
  selector: 'app-our-approach',
  imports: [CommonModule, Footer],
  templateUrl: './our-approach.html',
  styleUrl: './our-approach.scss',
})
export class OurApproach {
  persons: any = [
    {
      in: "https://www.linkedin.com/in/federico-p%C3%A9rez-manghi-md-cpi-91770925",
      img: "/persons/person1.jpg",
      imgMob: "/persons/person1-mob.jpg",
      fullname: "Federico\nPérez\u00A0Manghi",
      position1: "Co-Founder and Chief Medical Officer – Innova\u00A0Trials (United\u00A0States)",
      position2: "Founder, President and CEO -\u00A0CINME\u00A0(Argentina)",
      description: "Dr. Federico Pérez Manghi is the Founder and Chief Medical Officer of Innova Trials, a U.S.-based Clinical Research Organization headquartered in Key Biscayne, Florida. He leads the organization’s medical and scientific vision, ensuring clinical excellence, regulatory compliance, and patient safety across all trials. His leadership is central to Innova’s mission of expanding access to high-quality research in Latin America and beyond.\n\nIn addition to his role at Innova Trials, Dr. Pérez Manghi serves as President and CEO of CINME, a leading clinical research center in Argentina. With over 20 years of experience in clinical practice and research operations, he has built a reputation for bridging global pharmaceutical standards with local expertise. His work continues to\u00a0impact drug development pipelines and improve patient outcomes across the\u00a0region."
    },
    {
      in: "https://www.linkedin.com/in/milagros-p%C3%A9rez-manghi-93153512a/",
      img: "/persons/person2.jpg",
      imgMob: "/persons/person2-mob.jpg",
      fullname: "Milagros\nPérez\u00a0Manghi ",
      position1: "Co-Founder and Chief Executive Officer – Innova\u00A0Trials (United\u00A0States)",
      position2: "Chief Operating Officer – CINME\u00A0(Argentina)",
      description: "Milagros Pérez Manghi is an accomplished executive with a dual leadership role in the clinical research and healthcare sectors across the U.S. and Latin America. She currently serves as CEO of Innova Trials, a U.S.-based Clinical Research Organization (CRO) focused on accelerating innovation, operational excellence, and global partnerships in clinical development.\n\nIn parallel, she holds the position of COO at CINME (Centro de Investigaciones Metabólicas) in Buenos Aires, where she oversees financial strategy and has played a key role in aligning clinical operations with international regulatory and quality standards.\n\nWith a degree in International Trade from UADE and extensive experience working with global pharmaceutical sponsors and CROs, Milagros brings a unique blend of financial acumen, strategic vision, and operational leadership. Her work is defined by a commitment to transparency, cross-border collaboration, and raising the standard of clinical research in Latin America."
    },
    {
      in: "https://www.linkedin.com/in/santiagoip/en",
      img: "/persons/person3.jpg",
      imgMob: "/persons/person3-mob.jpg",
      fullname: "Santiago\nIsbert\u00a0Perlender ",
      position1: "Co-Founder and Chief Financial Officer – Innova\u00A0Trials (United\u00A0States)",
      position2: "Chief Financial Officer – CINME\u00A0(Argentina)",
      description: "Santiago Isbert Perlender is the Chief Financial Officer of Innova Trials, a clinical research organization based in Miami dedicated to accelerating drug development through innovative trial management and global site integration. As CFO, Santiago oversees financial strategy, capital allocation, and international expansion, playing a key role in driving the company’s growth across the U.S. and Latin America. His leadership ensures operational scalability while aligning financial discipline with Innova’s mission to transform the future of clinical trials.\n\nSantiago also serves as Chief Financial Officer of CINME (Centro de Investigaciones Metabólicas), one of Argentina’s leading research centers. In this role, he has spearheaded institutional restructuring, operational modernization, and strategic partnerships with both public and private stakeholders. His cross-continental experience gives him a unique perspective on the intersection of healthcare innovation, finance, and regulatory ecosystems. With a career bridging executive finance and clinical research operations, Santiago is known for his ability to align business performance with patient-focused research outcomes. His work continues to shape the way clinical research organizations scale responsibly and globally."
    },
    {
      in: "https://www.linkedin.com/in/daniel-a-cascon-57a19b7",
      img: "/persons/person4.jpg",
      imgMob: "/persons/person4-mob.jpg",
      fullname: "Daniel Cascon",
      position1: "Co-Founder and Chief Strategy\u00A0Officer",
      description: "Daniel Cascon is an Argentine-American entrepreneur with over three decades of leadership experience in executive sales and marketing roles across multinational corporations throughout the United States and Latin America. Known for his strategic vision and business acumen, Daniel has also served as a trusted advisor and board member for a variety of companies across the LATAM region, helping guide growth, innovation, and operational excellence.\n\nDaniel is the Co-Founder and Chief Strategy Officer of Innova Trials, a forward-thinking Clinical Research Organization (CRO) headquartered in Key Biscayne, Florida. Founded in 2024, Innova Trials is committed to modernizing clinical research through strategic partnerships, regional expertise, and a patient-centered approach. Under Daniel’s leadership, the company bridges global research standards with local execution, delivering high-quality solutions to sponsors and research sites alike.\n\nIn addition to his work in healthcare innovation, Daniel is also the Founder of Baires International Realty, a venture that showcases his longstanding passion for real estate development and investment. His diverse portfolio reflects a deep commitment to building impactful businesses that serve both people and progress."
    }

  ]
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  selectedIndex: number = 0;
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200,
        once: false,
        mirror: true,
      });
    }
  }
  scrollToPerson(index: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const targetId = `person-${index}`;
      const element = document.getElementById(targetId);

      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        this.selectedIndex = index;
      }
    }
  }

  expandedIndex: number | null = null;

  handleCardClick(index: number) {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.expandedIndex = this.expandedIndex === index ? null : index;

      setTimeout(() => AOS.refresh(), 300);
    } else {
      this.scrollToPerson(index);
    }
  }

  goToExternalUrl(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    }
  }
}
