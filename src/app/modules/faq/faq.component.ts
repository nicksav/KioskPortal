import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'faq-page',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  host: {'(document:click)': 'bodyClick($event)'}
})
export class FAQComponent implements OnInit {

  private openTab: string = '';
  public faqItems = [
    {
      question: `Question example one?`,
      answer: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.`
    },
    {
      question: `Question example two?`,
      answer: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.`
    },
    {
      question: `Question example three?`,
      answer: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.`
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  public toggleTab(data, e) {
    e.stopPropagation();
    if (this.openTab == data) this.openTab = '';
    else this.openTab = data;
  }

  public bodyClick(e) {
    this.openTab = '';
  }

}
