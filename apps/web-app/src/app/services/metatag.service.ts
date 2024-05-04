import { inject, Injectable } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { Article, Contact } from "../utils/types/types";

@Injectable({
  providedIn: "root",
})
export class MetatagService {
  private meta: Meta = inject(Meta);

  addTagsForContact(contact: Contact): void {
    const tags = [
      {
        name: "description",
        content: this.generateContactDesciption(contact),
      },
    ];
    tags.forEach((tag) => this.meta.updateTag(tag));
  }

  addTagsForArticle(article: Article): void {
    const tags = [
      {
        name: "author",
        content: article.author ?? "Unknown Author",
      },
      {
        name: "description",
        content: article.content ?? article.subtitle,
      },
      {
        name: "keywords",
        content: this.generateKeywords(article),
      },
      {
        name: "og:title",
        content: article.title,
      },
      {
        name: "og:type",
        content: "article",
      },
      {
        name: "og:description",
        content: article.content,
      },
      {
        name: "og:image",
        content: article.image?.url ?? "",
      },
      {
        name: "og:url",
        content: window.location.href,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ];

    tags.forEach((tag) => this.meta.updateTag(tag));
  }
  private generateKeywords(article: Article): string {
    return [
      article?.title,
      article?.author,
      article?.date,
      article?.subtitle,
    ].join(", ");
  }

  private generateContactDesciption(contact: Contact): string {
    return [
      contact?.street,
      contact?.location,
      contact?.additionalDescription,
      contact?.titleContact,
      contact?.titleLocation,
      contact?.titleMap,
      contact?.content,
      contact?.email,
      contact?.name,
      contact?.telephone,
      contact?.fax,
      contact?.mobil,
    ].join(" ");
  }
}
