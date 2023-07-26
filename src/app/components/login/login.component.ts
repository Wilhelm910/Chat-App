import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm = this.fb.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required]
  })

  /*
    loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true })
    })
  */

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private fb: NonNullableFormBuilder
  ) { }

  ngOnInit(): void {

  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  submit() {
    const { email, password } = this.loginForm.value;
    
    if (!this.loginForm.valid || !email || !password) {
      return;
    }

    this.authService.login(email, password).pipe(
      this.toast.observe({
        loading: 'Logging in ...',
        success: 'Logged in successfully',
        error: 'There was an error',
      })
    ).subscribe(() => {
      this.router.navigate(['/home']);
    })
  }

}
