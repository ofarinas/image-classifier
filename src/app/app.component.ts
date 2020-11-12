import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as ml5 from 'ml5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'trash-classifier';
  model: any;
  loading: boolean;
  imgSrc: any;
  @ViewChild('img') img: ElementRef;
  @ViewChild('video') video: ElementRef;
  predictions: any[];
  predictions2: any;


  async fileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = async (res: any) => {
        this.imgSrc = res.target.result;
        setTimeout(async () => {
          this.predictions = await this.model.classify(this.img.nativeElement);
        });
      };
    }
  }

  async ngAfterViewInit() {
    const vid = this.video.nativeElement;
    if (!vid && !this.model) {
      return;
    }
    const objectDetector = ml5.objectDetector('cocossd');

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          vid.srcObject = stream;
          setInterval(async () => {
            if (!this.model) {
              return;
            }
            this.predictions = await this.model.classify(this.video.nativeElement);
            this.predictions2 = await objectDetector.detect(this.video.nativeElement);
          }, 2000);

        })
        .catch((err0r) => {
          console.log('Something went wrong!');
        });
    }
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.model = await mobilenet.load();
  }

}
