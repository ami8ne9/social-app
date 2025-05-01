import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  visible=false;
  isdisabled=false;
  submit(signup:NgForm){
    this.isdisabled=true;
    const name=signup.form.value.Name
    const email=signup.form.value.Email
    const password=signup.form.value.Password
    fetch("http://localhost:5000/signup",{
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        Name:name,
        Email:email,
        Password:password
      })
    }).then(async (res) =>{
      const event=await res.json();
      if (event=='email sent'){
        window.location.href='/verification'
      }else{
        this.isdisabled=false;
        this.visible=true;
      }
    })
  }
}
