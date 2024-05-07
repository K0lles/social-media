import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent {
  // @Input() post = ;
  public comments = [
    {
      username: "lilachampoy",
      text: "Wow, that`s really cool. Could you tell more about this accident? Wow, that`s really cool. Could you tell more about this accident?" +
        " Wow, that`s really cool. Could you tell more about this accident? Wow, that`s really cool. " +
        "Could you tell more about this accident?"
    },
    {
      username: "biggiboss",
      text: "Really cool."
    }
  ]
}
