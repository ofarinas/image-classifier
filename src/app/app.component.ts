import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  model: any;
  imgSrc: any;
  @ViewChild('img') img: ElementRef;
  predictions: any[];


  async fileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (res: any) => {
      this.processImage(res);
    };
  }

  private processImage(res: any) {
    this.imgSrc = res.target.result;
    setTimeout(async () => {
      this.predictions = await this.model.classify(this.img.nativeElement);
    }, 10);
  }

  async ngOnInit(): Promise<void> {
    this.model = await mobilenet.load();
    console.log('model loaded');
  }

}
