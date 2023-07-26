import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { switchMap } from 'rxjs';

export function passwordsMatchValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDontMatch: true
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatchValidators() })

/*
  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordsMatchValidators() })
*/
  constructor(
    private authService: AuthenticationService,
    private toast: HotToastService,
    private router: Router,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder 

  ) { }

  ngOnInit(): void {

  }

  get name() {
    return this.signUpForm.get('name')
  }

  get email() {
    return this.signUpForm.get('email')
  }

  get password() {
    return this.signUpForm.get('password')
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword')
  }

  submit() {
    const { name, email, password } = this.signUpForm.value;
    if (!this.signUpForm.valid || !email || !password) {
      return;
    }

    
    this.authService.signUp(email, password).pipe(
      switchMap(({ user: { uid } }) => this.usersService.addUser({uid, email, displayName: name || ''})),
      this.toast.observe({
        success: 'Congrats! You signed up',
        loading: 'Signing in',
        error: ({ message }) => `${message}`
      })
    ).subscribe(() => {
      this.router.navigate(['/home'])
    })
  }

}
