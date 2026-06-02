import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../enviroments/envirments';
import emailjs from '@emailjs/browser';
import * as AOS from 'aos';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Footer } from '../../shell/footer/footer';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connect',
  imports: [ReactiveFormsModule, Footer],
  templateUrl: './connect.html',
  styleUrl: './connect.scss',
})
export class Connect {
  contactForm: FormGroup;
  isSending = false;
  constructor(private route: ActivatedRoute,private scroller: ViewportScroller, private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.contactForm = this.fb.group({
      user_name: ['', Validators.required],
      user_phone: [''],
      user_email: ['', [Validators.required, Validators.email]],
      user_company: [''],
      message: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.route.fragment.subscribe(frag => {
      if (frag) {
        setTimeout(() => {
          this.scroller.scrollToAnchor(frag);
        }, 150); 
      }
    });
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200,
        once: false,
        mirror: true,
      });
    }
  }
  async sendEmail() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;

    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        this.contactForm.value,
        environment.emailjs.publicKey
      );

      Swal.fire({
        title: '¡Mensaje enviado!',
        text: 'Tu consulta ha sido recibida correctamente.',
        icon: 'success',
        confirmButtonColor: '#2bbab1',
        confirmButtonText: 'OK'
      });

      this.contactForm.reset();
    } catch (error) {
      console.error('Error de EmailJS:', error);
      Swal.fire({
        title: 'Vaya...',
        text: 'Hubo un error al enviar el correo. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      this.isSending = false;
    }
  }
}
