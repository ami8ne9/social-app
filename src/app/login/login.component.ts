import { Component,signal,OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { application } from 'express';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {   
  visible=false;
  disabled=false;
  submit(login:NgForm){
    this.disabled=true;
    const Email = login.form.value.Email;
    const Password = login.form.value.password
    fetch('http://localhost:5000/login',{
      method:'POST',
      credentials: 'include',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email:Email,
        password:Password,
      })

    }).then(async(res)=>{
      const state=await res.json()
      console.log(state)
      if (state==true){
        window.location.href = '/home';
      }
      else{
        this.visible=true;
        this.disabled=false;
      }
    }
    )
  }
}
