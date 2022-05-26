import { Component, OnDestroy, OnInit } from '@angular/core';
import { auditTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;

  ngOnInit(): void {
    let activeIndex = 0;
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('aside > ul > li > a');

    const makeActive = (indexLink: number) =>
      menuLinks[indexLink]?.parentElement?.classList.add('active');

    const removeActive = (indexLink: number) =>
      menuLinks[indexLink]?.parentElement?.classList.remove('active');

    const removeAllActive = () => sections.forEach((_, index) => removeActive(index));

    const sectionsArray = Array.from(sections)
    const sectionOffset = 50;

    this.subscription = fromEvent(window, 'scroll').pipe(
      auditTime(10)
    ).subscribe(() => {
      const currentIndex =
        sectionsArray.findIndex(
          (section) => {
            const offsetTop = section.offsetTop - sectionOffset;
            return offsetTop <= window.scrollY && (offsetTop + section.clientHeight) > window.scrollY
          }
        );

      if (currentIndex !== activeIndex) {
        removeAllActive();
        activeIndex = currentIndex;
        makeActive(currentIndex);
      }
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}