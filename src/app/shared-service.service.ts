import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService implements OnInit {
  private userLoggedOut = new Subject<void>();
  public userLoggedOut$ = this.userLoggedOut.asObservable();
  // // constructing custom JSON object
  // aiObject:JSON;
  ai = [
    {
      assistant: 'None',
      instructions: 'Reply in concise manner, less than 50 words'
    },
    {
      assistant: 'Jarvis',
      instructions: "Please reply like Jarvis from the MCU when replying to the user's prompts, limit responses to less than 50 words"
    },
    {
      assistant: 'Edith',
      instructions: "Please reply like Peter Parker's AI Edith (from the MCU) when replying to the user's prompts, limit responses to less than 50 words"
    },
    {
      assistant: 'Friday',
      instructions: "Please reply like Tony Stark's AI Friday when replying to the user's prompts, limit responses to less than 50 words"
    }
  ]
  constructor(private http: HttpClient) {
    // this.aiObject=<JSON>this.ai;
  }
  ngOnInit(): void { }
  open_apikey = environment.OPENAI_API_KEY;
  model: string = 'gpt-3.5-turbo';

  apiUrl: string = 'https://api.openai.com/v1/chat/completions'; // set openAI API Url
  openaioptions: Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.open_apikey}`
    })
  }
  // method for finding the correct system prompt
  modelFinder(assistant: string) {
    const foundIndex = this.ai.findIndex(item => item.assistant === assistant);

    if (foundIndex !== -1) {
      // The assistant was found, and foundIndex contains the index
      const instructions = this.ai[foundIndex].instructions;
      // console.log('This is the corresponding instructions', instructions);
      return instructions;
    } else {
      // The assistant was not found
      console.log('Assistant not found');
      return this.ai[0].instructions;

    }
  }

  // method for calling openaiChat
  openaiChat(prompt: string, assistant: string, model: string = this.model): Promise<any> {
    const instructions = this.modelFinder(assistant); // find corresponding prompts first
    const requestData = {
      model: model,
      messages: [
        { role: 'system', content: instructions },
        { role: 'user', content: prompt }
      ]
    };
    // make the post request by returning promise (signaling API request completion)
    return new Promise<any>((resolve, reject) => {
      this.http.post(this.apiUrl, requestData, this.openaioptions).subscribe(
        (response) => {
          // Handle the successful response here
          // console.log('OpenAI Response:', response);
          resolve(response); // signals that response was successful
        },
        (error) => {
          // Handle any errors that occurred during the request
          console.error('Error making OpenAI request:', error);
          reject(error); // signals that response was not successful
        }
      );
    });
  }

  private someDataSubject = new BehaviorSubject<any>(false);
  someData$ = this.someDataSubject.asObservable();
  sharedData = {
    firstName: '',
    encoder: ''
  };
  // specifically for showing hamburger menu after logging in
  updateData(data: any) {
    this.someDataSubject.next(data);
  }
  // method for remembering user first name
  updateUserName(name: string) {
    const encodedName = btoa(name);
    // console.log('This is the encodedName', encodedName);
    this.sharedData = {
      firstName: name,
      encoder: encodedName
    }
  }
  // method that logs out user
  logOutUser() {
    this.userLoggedOut.next();
  }
}
