import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-verification',
  imports: [FormsModule,CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.css'
})
export class VerificationComponent {
  visible=false
  isdisabled=false
  submit(verif:NgForm){
    const code=verif.form.value.code;
    this.isdisabled=true;
    fetch('http://localhost:5000/verification',{
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        Code:code,
      })
    }).then(async(res)=>{
      const data=await res.json()
      if (data =='the user is added to db'){
        window.location.href='/login';
      }else{
        this.visible=true;
        this.isdisabled=false;
      }
    })
  }
}
