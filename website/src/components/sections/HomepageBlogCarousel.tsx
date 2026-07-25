// Blog41 adaptation: keep the public copy and unpublished state, while using
// the reference block's responsive carousel, card, badge, and control pattern.
import { IconArrowRight } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type BlogPreview = {
  description: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  number: string;
  title: string;
  tone: "body" | "changes" | "relations";
};

type HomepageBlogCarouselProps = {
  previews: ReadonlyArray<BlogPreview>;
};

function HomepageBlogCarousel({ previews }: HomepageBlogCarouselProps) {
  return (
    <Carousel
      className="homepage-blog__carousel"
      opts={{ align: "start" }}
      aria-label="Articole în pregătire"
      aria-roledescription="carusel"
    >
      <header className="homepage-blog__header">
        <div className="homepage-blog__heading">
          <Badge variant="secondary">Din blog</Badge>
          <h2 id="homepage-blog-title">Texte pentru reflecție</h2>
          <p>
            Trei teme care vor fi dezvoltate în articole viitoare. Textele vor
            fi publicate după redactare și revizuire.
          </p>
        </div>

        <div className="homepage-blog__actions">
          <Button asChild variant="secondary" size="inline">
            <a href="/blog/">
              Deschideți blogul
              <IconArrowRight data-icon="inline-end" aria-hidden="true" />
            </a>
          </Button>

          <div className="homepage-blog__controls">
            <CarouselPrevious
              className="homepage-blog__control"
              aria-label="Articolul anterior"
            />
            <CarouselNext
              className="homepage-blog__control"
              aria-label="Articolul următor"
            />
          </div>
        </div>
      </header>

      <CarouselContent className="homepage-blog__track">
        {previews.map((preview) => (
          <CarouselItem
            key={preview.number}
            className="homepage-blog__slide basis-[88%] sm:basis-[55%] lg:basis-1/3"
            aria-label={`${preview.number} din ${previews.length}`}
            aria-roledescription="articol"
          >
            <Card className="homepage-blog__card h-full gap-0 py-0">
              <div className="homepage-blog__visual" data-tone={preview.tone}>
                <img
                  src={preview.imageSrc}
                  width={preview.imageWidth}
                  height={preview.imageHeight}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <Badge variant="secondary" className="homepage-blog__status">
                  În pregătire
                </Badge>
              </div>

              <CardHeader className="homepage-blog__card-header">
                <CardTitle asChild>
                  <h3 className="homepage-blog__card-title">{preview.title}</h3>
                </CardTitle>
                <CardDescription className="homepage-blog__card-description">
                  {preview.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="homepage-blog__card-footer">
                <Badge variant="outline">{preview.number}</Badge>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default HomepageBlogCarousel;
