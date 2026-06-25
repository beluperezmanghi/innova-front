import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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
      const formData = {
        name: this.contactForm.value.user_name,
        phone: this.contactForm.value.user_phone || 'Not provided',
        email: this.contactForm.value.user_email,
        company: this.contactForm.value.user_company || 'Not provided',
        message: this.contactForm.value.message,
        _subject: 'New contact form message - Innova Trials',
        _template: 'table'
      };

      const response = await fetch('https://formsubmit.co/ajax/info@innovatrials.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('FormSubmit error');
      }

      Swal.fire({
        title: 'Message sent!',
        text: 'Your message has been received successfully.',
        icon: 'success',
        confirmButtonColor: '#2bbab1',
        confirmButtonText: 'OK'
      });

      this.contactForm.reset();

    } catch (error) {
      console.error('Form error:', error);

      Swal.fire({
        title: 'Oops...',
        text: 'There was an error sending your message. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });

    } finally {
      this.isSending = false;
    }
  }
}